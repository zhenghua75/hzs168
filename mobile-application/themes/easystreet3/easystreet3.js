/**
 * Implements DrupalGap's template_info() hook.
 */
function easystreet3_info() {
  try {
    var theme = {
      name: 'easystreet3',
      regions: {
        header: {
          attributes: {
            'data-role': 'header',
            'data-theme': 'c',
            //'data-fullscreen': true,
            'data-position': 'fixed',
            'data-tap-toggle': 'false'
          }
        },
        sub_header: {
          attributes: {
            'data-role': 'header',
            //'data-theme': 'b',
          }
        },
        navigation: {
          attributes: {
            'data-role': 'navbar',
            //'data-theme': 'b',
          }
        },
        content: {
          attributes: {
            'class': 'ui-content',
            'role': 'main',
            //'data-theme': 'b',
          }
        },
        footer: {
          attributes: {
            'left-data-role':'navbar',
            'data-role': 'footer',
            //'data-theme': 'b',
            'data-position': 'fixed',
            //'data-fullscreen': true
            'data-tap-toggle': 'false'
          }
        }
      }
    };
    return theme;
  }
  catch (error) { drupalgap_error(error); }
}

