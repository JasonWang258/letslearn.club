module.exports = {
  'presets': [
    [
      '@vue/app',
      {
        'useBuiltIns': 'entry'
      }
    ]
  ],
  'plugins': [
    [
      'transform-imports',
      {
        'vuetify': {
          'transform': 'vuetify/es5/components/${member}',
          'preventFullImport': true
        }
      }
    ],
    [
      'prismjs', {
        'languages': ['javascript', 'css', 'python'],
        'plugins': ['line-numbers'],
        'theme': 'okaidia',
        'css': true
      }
    ]
  ]
}
