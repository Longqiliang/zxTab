
(function ($) {
  var initializing = false,
    fnTest = /xyz/.test(function () {
      xyz;
    }) ? /\b_super\b/ : /.*/;

  var Class = function () {};
  Class.extend = function (prop) {
    var _super = this.prototype;
    initializing = true;
    var prototype = new this();
    initializing = false;
    for (var name in prop) {
      prototype[name] = typeof prop[name] == "function" &&
        typeof _super[name] == "function" && fnTest.test(prop[name]) ?
        (function (name, fn) {
          return function () {
            var tmp = this._super;

            this._super = _super[name];

            var ret = fn.apply(this, arguments);
            this._super = tmp;

            return ret;
          };
        })(name, prop[name]) :
        prop[name];
    }

    function Class() {
      if (!initializing && this.init)
        this.init.apply(this, arguments);
    }
    Class.prototype = prototype;
    Class.prototype.constructor = Class;
    Class.extend = arguments.callee;
    return Class;
  };
  $.Class = Class;
})($);

(function ($, window, document) {
  var UserList = $.UserList = function (holder, items) {
    var self = this
    self.holder = holder
    self.items = items || []
    self.init()


  }

  UserList.prototype.findElementItems = function () {
    var self = this
    self.elementItems = [].slice.call(self.holder.querySelectorAll('li'))
    return self.elementItems
  }

  UserList.prototype.init = function () {
    var self = this
    self.list = self.holder.querySelector('ul')
    self.findElementItems()

  }

  UserList.prototype.setUserItems = function (items) {
    var self = this
    self.items = items || []
    var buffer = []
    self.items.forEach(function (item) {
      if (item) {
        var itemDom = '<li class="zx-tab-list-item">\
              <div class="item-img-box">\
                <img src="' + item.img + '" >\
              </div>\
              <div class="item-content item-checkbox ellipsis">\
                <input type="checkbox" class="zx-checked" name="checkbox1">\
                <span>' + item.name + '</span>\
              </div>\
            </li>'
        buffer.push(itemDom)
      }
    })
    self.list.innerHTML = buffer.join('')

  }

  UserList.prototype.setDeptItems = function () {

  }

  UserList.prototype.setSelectedUserItem = function () {
    var self = this
    return self.items
  }

  UserList.prototype.getSelectedUserItem = function () {

  }


  if ($.fn) {
		$.fn.tab = function(options) {
      console.log(this, options)
      this.each(function(i, element) {
        if (i === 0) {
          if (element.tab) {
            return
          }
          if (options) {
            element.tab = new UserList(element, options)
          } else {
            element.tab = new UserList(element)
          }
        }
      })	
      return this[0] ? this[0].tab : null;
		}

		//自动初始化
		$(function() {
			$('.zx-tab-content').tab()
		})
	}


  // var Initials = $('.initials');
  // var LetterBox = $('#letter');
  // Initials.find('ul').append(
  //   '<li>A</li><li>B</li><li>C</li><li>D</li><li>E</li><li>F</li><li>G</li><li>H</li><li>I</li><li>J</li><li>K</li><li>L</li><li>M</li><li>N</li><li>O</li><li>P</li><li>Q</li><li>R</li><li>S</li><li>T</li><li>U</li><li>V</li><li>W</li><li>X</li><li>Y</li><li>Z</li><li>#</li>'
  // );
  // //initials();
  // $('.tab').on('click', '.tab-item', function (e) {
  //   e.preventDefault()
  //   var $this = $(this)
  //   $this.addClass('active').siblings().removeClass('active')
  // })
  // $(".initials ul li").click(function () {
  //   var _this = $(this);
  //   var LetterHtml = _this.html();
  //   LetterBox.html(LetterHtml).fadeIn();

  //   Initials.css('background', 'rgba(145,145,145,0.6)');

  //   setTimeout(function () {
  //     Initials.css('background', 'rgba(145,145,145,0)');
  //     LetterBox.fadeOut();
  //   }, 1000);

  //   var _index = _this.index()
  //   if (_index == 0) {
  //     $('html,body').animate({
  //       scrollTop: '0px'
  //     }, 300); //点击第一个滚到顶部
  //   } else if (_index == 27) {
  //     var DefaultTop = $('#default').position().top;
  //     $('html,body').animate({
  //       scrollTop: DefaultTop + 'px'
  //     }, 300); //点击最后一个滚到#号
  //   } else {
  //     var letter = _this.text();
  //     if ($('#' + letter).length > 0) {
  //       var LetterTop = $('#' + letter).position().top;
  //       $('html,body').animate({
  //         scrollTop: LetterTop - 45 + 'px'
  //       }, 300);
  //     }
  //   }
  // })

  // var windowHeight = $(window).height();
  // var InitHeight = windowHeight - 45;
  // Initials.height(InitHeight);
  // var LiHeight = InitHeight / 28;
  // Initials.find('li').height(LiHeight);



  // function initials() { //人员排序
  //   var SortList = $(".sort_list");
  //   var SortBox = $(".sort_box");
  //   SortList.sort(asc_sort).appendTo('.sort_box'); //按首字母排序
  //   function asc_sort(a, b) {
  //     return makePy($(b).find('.num_name').text().charAt(0))[0].toUpperCase() < makePy($(a).find('.num_name').text()
  //       .charAt(
  //         0))[0].toUpperCase() ? 1 : -1;
  //   }

  //   var initials = [];
  //   var num = 0;
  //   SortList.each(function (i) {
  //     var initial = makePy($(this).find('.num_name').text().charAt(0))[0].toUpperCase();
  //     if (initial >= 'A' && initial <= 'Z') {
  //       if (initials.indexOf(initial) === -1)
  //         initials.push(initial);
  //     } else {
  //       num++;
  //     }
  //   });

  //   $.each(initials, function (index, value) { //添加首字母标签
  //     SortBox.append('<div class="sort_letter" id="' + value + '">' + value + '</div>');
  //   });
  //   if (num != 0) {
  //     SortBox.append('<div class="sort_letter" id="default">#</div>');
  //   }

  //   for (var i = 0; i < SortList.length; i++) { //插入到对应的首字母后面
  //     var letter = makePy(SortList.eq(i).find('.num_name').text().charAt(0))[0].toUpperCase();
  //     switch (letter) {
  //       case "A":
  //         $('#A').after(SortList.eq(i));
  //         break;
  //       case "B":
  //         $('#B').after(SortList.eq(i));
  //         break;
  //       case "C":
  //         $('#C').after(SortList.eq(i));
  //         break;
  //       case "D":
  //         $('#D').after(SortList.eq(i));
  //         break;
  //       case "E":
  //         $('#E').after(SortList.eq(i));
  //         break;
  //       case "F":
  //         $('#F').after(SortList.eq(i));
  //         break;
  //       case "G":
  //         $('#G').after(SortList.eq(i));
  //         break;
  //       case "H":
  //         $('#H').after(SortList.eq(i));
  //         break;
  //       case "I":
  //         $('#I').after(SortList.eq(i));
  //         break;
  //       case "J":
  //         $('#J').after(SortList.eq(i));
  //         break;
  //       case "K":
  //         $('#K').after(SortList.eq(i));
  //         break;
  //       case "L":
  //         $('#L').after(SortList.eq(i));
  //         break;
  //       case "M":
  //         $('#M').after(SortList.eq(i));
  //         break;
  //       case "N":
  //         $('#N').after(SortList.eq(i));
  //         break;
  //       case "O":
  //         $('#O').after(SortList.eq(i));
  //         break;
  //       case "P":
  //         $('#P').after(SortList.eq(i));
  //         break;
  //       case "Q":
  //         $('#Q').after(SortList.eq(i));
  //         break;
  //       case "R":
  //         $('#R').after(SortList.eq(i));
  //         break;
  //       case "S":
  //         $('#S').after(SortList.eq(i));
  //         break;
  //       case "T":
  //         $('#T').after(SortList.eq(i));
  //         break;
  //       case "U":
  //         $('#U').after(SortList.eq(i));
  //         break;
  //       case "V":
  //         $('#V').after(SortList.eq(i));
  //         break;
  //       case "W":
  //         $('#W').after(SortList.eq(i));
  //         break;
  //       case "X":
  //         $('#X').after(SortList.eq(i));
  //         break;
  //       case "Y":
  //         $('#Y').after(SortList.eq(i));
  //         break;
  //       case "Z":
  //         $('#Z').after(SortList.eq(i));
  //         break;
  //       default:
  //         $('#default').after(SortList.eq(i));
  //         break;
  //     }
  //   }
  // }
})($, window, document);


(function ($, document) {

  var panelBuffer = `<div class="zx-layout">
    <div class="zx-tab-container">
      <div class="zx-tab-content active" data-id="tab-c">
      
      </div>
    </div>
    <div class="zx-tab-footer">
      <button class="zx-btn zx-btn-default zx-tab-btn-ok" data-id="btn-cancel">取消</button>
      <span class="zx-tab-footer-txt">已选择<span class="zx-tab-footer-num">0</span>人</span>
      <button class="zx-btn zx-btn-info zx-tab-btn-ok" data-id="btn-ok">确定</button>
    </div>
  </div>`;

  // 定义弹出窗口类
  var PopTab = $.PopTab = $.Class.extend({
    init: function (options) {
      var self = this
      var _tab = $(panelBuffer)[0]
      $('body').append(_tab)
      var ui = self.ui = {
        tab: _tab,
        ok: $('[data-id="btn-ok"]', _tab)[0],
        cancel: $('[data-id="btn-cancel"]', _tab)[0],
        body: $('.zx-tab-container', _tab)[0],
        txt: $('.zx-tab-footer-txt', _tab)[0],
        num: $('.zx-tab-footer-num', _tab)[0],
        c: $('[data-id="tab-c"]', _tab)[0],
        d: $('[data-id="tab-d"]', _tab)[0],
        a: $('[data-id="tab-a"]', _tab)[0],
      }



      ui.cancel.addEventListener('tap', function (event) {
        self.hide()
      }, false)
      ui.ok.addEventListener('tap', function (event) {
        if (self.callback) {
          var rs = self.callback(self.getSelectedItems())
          if (rs !== false) {
            self.hide()
          }
        }
      }, false)
      self._create(options)
    },
    _createConcacts: function () {
      var self = this
      var options = self.options
      var ui = self.ui
      console.log(self, ui.c.tab)
      if (options.userList) {
        uArray = options.userList
      }
      ui.c.tab.setUserItems(uArray)
    },
    _createDepartment: function () {

    },
    _createAllUsers: function () {

    },
    _create: function (options) {
      var self = this
      options = options || {}
      options.userList = options.userList
      self.options = options
      var ui = self.ui
      self._createConcacts()
    },
    //显示
    show: function (callback) {
      var self = this;
      self.callback = callback;
      self.panel.classList.add($.className('active'))
    },
    //隐藏
    hide: function () {
      var self = this
      if (self.disposed) return
      self.panel.classList.remove($.className('active'))
    },
    dispose: function () {
      var self = this
      self.hide()
      setTimeout(function () {
        self.panel.parentNode.removeChild(self.panel)
        for (var name in self) {
          self[name] = null;
          delete self[name]
        }
        self.disposed = true
      }, 300)
    }
  });


})($, document);