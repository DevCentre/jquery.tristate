/***********************************************************************
 * Copyright (c) 2010 Bit Thicket Software
 * Copyright (c) 2010 BadrIT (www.badrit.com)
 *
 * Permission is hereby granted, free of charge, to any person
 * obtaining a copy of this software and associated documentation
 * files (the "Software"), to deal in the Software without
 * restriction, including without limitation the rights to use, copy,
 * modify, merge, publish, distribute, sublicense, and/or sell copies
 * of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
 * MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS
 * BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN
 * ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
 * CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

(function($) {
    $.fn.tristate = function(settings) {
        var config = {
            initialState: 'intermediate',
            imgPath: 'images/',
            auto_intermediate: true,
            after: null
        };

        if (settings) $.extend(config, settings);

        if (config.auto_intermediate) {
          var getNextState = function(state) {
              switch (state) {
              case 'intermediate':
                  return 'unchecked';
              case 'unchecked':
                  return 'checked';
              case 'checked':
                  return 'intermediate';
              }
          }
        } else {
          var getNextState = function(state) {
              switch (state) {
              case 'intermediate':
                  return 'unchecked';
              case 'unchecked':
                  return 'checked';
              case 'checked':
                  return 'unchecked';
              }
          }
        }

        this.each(function() {
            var html = '<img src="' + config.imgPath + config.initialState + '.png' + '"/>' +
                '<input type="hidden" value="' + config.initialState + '" name="'+$(this).name'"/>';
            $(this).after(html);
            $(this).hide();

            $(this).unbind('click');
            $(this).next('img').click(function() {
                main_checkbox = $(this).prev(':checkbox');
                var nextState = getNextState(main_checkbox.next().next().val());
                main_checkbox.setState(nextState);
            });

            $(this).next().hover(function() {   /* in */
                var src = $(this).attr('src').replace(/\.png$/i, '_highlighted.png');
                $(this).attr('src', src);
            }, function() {                     /* out */
                var src = $(this).attr('src').replace(/_highlighted/, '');
                $(this).attr('src', src);
            });

            // Allows labels for this checkbox to update state
            var input_id = $(this).attr('id');
            if (input_id) {
              $(this).parents('form').find('label').each( function() {
                if ($(this).attr("for") == input_id) {
                  $(this).click(function() {
                    var label_for = $(this).attr('for')
                    var main_checkbox = $(this).parents('form').find(':checkbox#'+label_for);
                    var nextState = getNextState(main_checkbox.next().next().val());
                    main_checkbox.setState(nextState);
                  });

                  $(this).hover(function() {   /* in */
                    var label_for = $(this).attr('for')
                    var main_checkbox = $(this).parents('form').find(':checkbox#'+label_for);
                    var img = main_checkbox.next();
                    var newSrc = img.attr('src').replace(/\.png$/i, '_highlighted.png');
                    img.attr('src', newSrc);
                  }, function() {                     /* out */
                    var label_for = $(this).attr('for')
                    var main_checkbox = $(this).parents('form').find(':checkbox#'+label_for);
                    var img = main_checkbox.next();
                    var newSrc = img.attr('src').replace(/_highlighted/, '');
                    img.attr('src', newSrc);
                  });
                }
              });
            }

            if (settings && settings.after)
                settings.after(this);
        });
        
        $.fn.getState = function() {
          return $(this).next().next().val();
        }

        $.fn.setState = function(newState) {
          var main_checkbox = $(this);
          main_checkbox.next().attr('src', config.imgPath + newState + '.png');
          main_checkbox.next().next().val(newState);
          $(this).trigger('stateChanged');
        }
        
        $.fn.stateChanged = function(handler) {
          if (handler == null) {
            $(this).trigger('stateChanged');
          } else {
            $(this).bind('stateChanged', handler);
          }
        }
    };
})(jQuery);
