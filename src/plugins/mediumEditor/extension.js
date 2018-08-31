import MediumEditor from 'medium-editor'
import rangy from 'rangy'
import 'rangy/lib/rangy-classapplier'
import Prism from 'prismjs'

rangy.init()

var HighlighterButton = MediumEditor.extensions.button.extend({
  name: 'highlighter',
  tagNames: ['mark'],
  contentDefault: '<b>H</b>',
  contentFA: '<i class="fa fa-paint-brush"></i>',
  aria: 'Highlight',
  action: 'highlight',

  init: function () {
    MediumEditor.extensions.button.prototype.init.call(this)
    this.classApplier = rangy.createClassApplier('highlight', {
      elementTagName: 'mark',
      mormalize: true
    })
  },
  handleClick: function (event) {
    this.classApplier.toggleSelection()
    // Ensure the editor knows about an html change so watchers are notified
    // ie: <textarea> elements depend on the editableInput event to stay synchronized
    this.base.checkContentChanged()
  }
})

var CodeForm = MediumEditor.extensions.form.extend({
  name: 'code',
  action: 'formatCode',
  aria: 'code syntax highlighter',
  tagNames: ['pre', 'code'],
  contentDefault: '<b>Code</>',
  contentFA: '<i class="fa fa-code"></i>',
  placeholderText: 'Choose Code Language',
  init: function () {
    MediumEditor.extensions.form.prototype.init.apply(this, arguments)
    this.subscribe('editableKeydown', this.handleKeydown.bind(this))
  },
  handleClick: function (event) {
    event.preventDefault()
    event.stopPropagation()
    var range = MediumEditor.selection.getSelectionRange(this.document)
    if (range.startContainer.nodeName.toLowerCase() === 'pre' ||
      range.endContainer.nodeName.toLowerCase() === 'pre' ||
      MediumEditor.util.getClosestTag(MediumEditor.selection.getSelectedParentElement(range), 'pre')) {
      return this.removeFormat()
    }
    if (!this.isDisplayed()) {
      this.showForm()
    }
    return false
  },
  // Called when user hits the defined shortcut (CTRL / COMMAND + L)
  handleKeydown: function (event) {
    let L = 76
    if (MediumEditor.util.isKey(event, L) && MediumEditor.util.isMetaCtrlKey(event) && !event.shiftKey) {
      this.handleClick(event)
    }
  },
  getForm: function () {
    if (!this.form) {
      this.form = this.createForm()
    }
    return this.form
  },
  getTemplate: function () {
    var template = [
      '<input type="text" class="medium-editor-toolbar-input" placeholder="', this.placeholderText, '">'
    ]

    template.push(
      '<a href="#" class="medium-editor-toolbar-save">',
      this.getEditorOption('buttonLabels') === 'fontawesome' ? '<i class="fa fa-check"></i>' : this.formSaveLabel,
      '</a>'
    )

    template.push('<a href="#" class="medium-editor-toolbar-close">',
      this.getEditorOption('buttonLabels') === 'fontawesome' ? '<i class="fa fa-times"></i>' : this.formCloseLabel,
      '</a>')

    return template.join('')
  },
  // Used by medium-editor when the default toolbar is to be displayed
  isDisplayed: function () {
    return MediumEditor.extensions.form.prototype.isDisplayed.apply(this)
  },

  hideForm: function () {
    MediumEditor.extensions.form.prototype.hideForm.apply(this)
    this.getInput().value = ''
  },

  showForm: function (opts) {
    var input = this.getInput()

    opts = opts || { value: '' }
    if (typeof opts === 'string') {
      opts = {
        value: opts
      }
    }

    this.base.saveSelection()
    this.hideToolbarDefaultActions()
    MediumEditor.extensions.form.prototype.showForm.apply(this)
    this.setToolbarPosition()

    input.value = opts.value
    input.focus()

            // If we have a custom class checkbox, we want it to be checked/unchecked
            // based on whether an existing link already has the class
            if (buttonCheckbox) {
                var classList = opts.buttonClass ? opts.buttonClass.split(' ') : [];
                buttonCheckbox.checked = (classList.indexOf(this.customClassOption) !== -1);
            }
        },

  // Called by core when tearing down medium-editor (destroy)
  destroy: function () {
    if (!this.form) {
      return false
    }

    if (this.form.parentNode) {
      this.form.parentNode.removeChild(this.form)
    }

    delete this.form
  },

  // core methods

  getFormOpts: function () {
    // no notion of private functions? wanted `_getFormOpts`
    var targetCheckbox = this.getAnchorTargetCheckbox()
    var buttonCheckbox = this.getAnchorButtonCheckbox()
    var opts = {
      value: this.getInput().value.trim()
    }

    if (this.linkValidation) {
      opts.value = this.checkLinkFormat(opts.value)
    }

    opts.target = '_self'
    if (targetCheckbox && targetCheckbox.checked) {
      opts.target = '_blank'
    }

    if (buttonCheckbox && buttonCheckbox.checked) {
      opts.buttonClass = this.customClassOption
    }

    return opts
  },

  doFormSave: function () {
    var opts = this.getFormOpts();
    this.completeFormSave(opts);
  },

  completeFormSave: function (opts) {
    this.base.restoreSelection();
    this.execAction(this.action, opts);
    this.base.checkSelection();
  },

  ensureEncodedUri: function (str) {
    return str === decodeURI(str) ? encodeURI(str) : str;
  },

  ensureEncodedUriComponent: function (str) {
    return str === decodeURIComponent(str) ? encodeURIComponent(str) : str;
  },

  ensureEncodedParam: function (param) {
    var split = param.split('=')
    var key = split[0]
    var val = split[1]

    return key + (val === undefined ? '' : '=' + this.ensureEncodedUriComponent(val))
  },

  ensureEncodedQuery: function (queryString) {
    return queryString.split('&').map(this.ensureEncodedParam.bind(this)).join('&');
  },

        checkLinkFormat: function (value) {
            // Matches any alphabetical characters followed by ://
            // Matches protocol relative "//"
            // Matches common external protocols "mailto:" "tel:" "maps:"
            // Matches relative hash link, begins with "#"
            var urlSchemeRegex = /^([a-z]+:)?\/\/|^(mailto|tel|maps):|^\#/i,
                hasScheme = urlSchemeRegex.test(value),
                scheme = '',
                // telRegex is a regex for checking if the string is a telephone number
                telRegex = /^\+?\s?\(?(?:\d\s?\-?\)?){3,20}$/,
                urlParts = value.match(/^(.*?)(?:\?(.*?))?(?:#(.*))?$/),
                path = urlParts[1],
                query = urlParts[2],
                fragment = urlParts[3];

            if (telRegex.test(value)) {
                return 'tel:' + value;
            }

            if (!hasScheme) {
                var host = path.split('/')[0];
                // if the host part of the path looks like a hostname
                if (host.match(/.+(\.|:).+/) || host === 'localhost') {
                    scheme = 'http://';
                }
            }

            return scheme +
                // Ensure path is encoded
                this.ensureEncodedUri(path) +
                // Ensure query is encoded
                (query === undefined ? '' : '?' + this.ensureEncodedQuery(query)) +
                // Include fragment unencoded as encodeUriComponent is too
                // heavy handed for the many characters allowed in a fragment
                (fragment === undefined ? '' : '#' + fragment);
        },

  doFormCancel: function () {
    this.base.restoreSelection();
    this.base.checkSelection();
  },

  // form creation and event handling
  attachFormEvents: function (form) {
    var close = form.querySelector('.medium-editor-toolbar-close'),
        save = form.querySelector('.medium-editor-toolbar-save'),
        input = form.querySelector('.medium-editor-toolbar-input');

    // Handle clicks on the form itself
    this.on(form, 'click', this.handleFormClick.bind(this));

    // Handle typing in the textbox
    this.on(input, 'keyup', this.handleTextboxKeyup.bind(this));

    // Handle close button clicks
    this.on(close, 'click', this.handleCloseClick.bind(this));

    // Handle save button clicks (capture)
    this.on(save, 'click', this.handleSaveClick.bind(this), true);

  },

  createForm: function () {
    var doc = this.document,
        form = doc.createElement('div');

    // Anchor Form (div)
    form.className = 'medium-editor-toolbar-form';
    form.id = 'medium-editor-toolbar-form-anchor-' + this.getEditorId();
    form.innerHTML = this.getTemplate();
    this.attachFormEvents(form);

    return form;
  },

  getInput: function () {
    return this.getForm().querySelector('input.medium-editor-toolbar-input');
  },

  handleTextboxKeyup: function (event) {
    // For ENTER -> create the anchor
    if (event.keyCode === MediumEditor.util.keyCode.ENTER) {
        event.preventDefault();
        this.doFormSave();
        return;
    }

    // For ESCAPE -> close the form
    if (event.keyCode === MediumEditor.util.keyCode.ESCAPE) {
        event.preventDefault();
        this.doFormCancel();
    }
  },

  handleFormClick: function (event) {
      // make sure not to hide form when clicking inside the form
      event.stopPropagation();
  },

  handleSaveClick: function (event) {
    // Clicking Save -> create the anchor
    event.preventDefault()
    this.doFormSave()
  },

  handleCloseClick: function (event) {
    // Click Close -> close the form
    event.preventDefault()
    this.doFormCancel()
  }
})

export default { HighlighterButton, CodeForm }
