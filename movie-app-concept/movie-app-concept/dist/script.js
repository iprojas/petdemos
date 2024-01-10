import VueCardStack from 'https://assets.codepen.io/152347/vue-card-stack.esm.js?skahdfjahj';

var script = {
  components: {
    VueCardStack
  },
  computed: {
    getInfoStyles() {
      const SPEED = 0.25;

      if (this.stack.length) {
        const styles = this.cards.map((card, index) => {
          const cardInStack = this.stack.find((x) => x.id === card.id);
          const cardIndexInStack = this.stack.findIndex(
            (x) => x.id === card.id
          );

          const yPosFactor = this.convertRange(
            cardInStack.xPos,
            [0, 69],
            [1, 0]
          );

          if (this.direction === "left") {
            const o = (i) => {
              if (this.isDragging) {
                if (i === 0) {
                  return this.convertRange(cardInStack.xPos, [380, 69], [0, 1]);
                } else if (i === 1) {
                  return this.convertRange(cardInStack.xPos, [69, 65], [1, 0]);
                } else {
                  return 0;
                }
              } else {
                return i === 1 ? 1 : 0;
              }
            };

            return {
              transform: `translate(0, ${
                cardIndexInStack === 0
                  ? 5 * yPosFactor
                  : (cardIndexInStack + 1) * (100 * yPosFactor)
              }px)`,
              transition: `transform ${
                this.isDragging && !(cardIndexInStack > 1) ? 0 : SPEED
              }s ease 0s, opacity ${this.isDragging ? 0 : SPEED}s ease 0s`,
              opacity: o(cardIndexInStack)
            };
          } else {
            const o = (i) => {
              if (this.isDragging) {
                if (i === 1) {
                  return this.convertRange(cardInStack.xPos, [69, 200], [1, 0]);
                } else if (i === 2) {
                  return this.convertRange(cardInStack.xPos, [55, 69], [0, 1]);
                } else {
                  return 0;
                }
              } else {
                return i === 1 ? 1 : 0;
              }
            };

            return {
              transform: `translate(0, ${
                cardIndexInStack === 1
                  ? 5 * yPosFactor
                  : (cardIndexInStack - 1) * (100 * yPosFactor)
              }px)`,
              transition: `transform ${
                this.isDragging && !(cardIndexInStack > 2) ? 0 : SPEED
              }s ease 0s, opacity ${this.isDragging ? 0 : SPEED}s ease 0s`,
              opacity: o(cardIndexInStack)
            };
          }
        });

        return styles;
      }

      return {};
    }
  },
  methods: {
    convertRange(value, r1, r2) {
      return ((value - r1[0]) * (r2[1] - r2[0])) / (r1[1] - r1[0]) + r2[0];
    },
    getStyles(card) {
      const MIN_POS_X = 0;
      const MAX_POS_X = 69;
      const MIN_SCALE_FACTOR = 1;
      const MAX_SCALE_FACTOR = 2.5;

      const opacity = this.convertRange(
        card.xPos > 0 ? card.xPos : 0,
        [MIN_POS_X, MAX_POS_X],
        [0, 1]
      );

      const scale = this.convertRange(
        card.xPos > 0 ? card.xPos : 0,
        [MIN_POS_X, MAX_POS_X],
        [MAX_SCALE_FACTOR, 1]
      );

      const normalizedScale =
        scale >= MIN_SCALE_FACTOR
          ? scale <= MAX_SCALE_FACTOR
            ? scale
            : MAX_SCALE_FACTOR
          : MIN_SCALE_FACTOR;

      const normalizedOpacity = opacity >= 0 ? (opacity <= 1 ? opacity : 1) : 0;

      return {
        transform: `scale(${card.$index !== 0 ? normalizedScale : 1}, ${
          card.$index !== 0 ? normalizedScale : MIN_SCALE_FACTOR
        })`,
        opacity: `${card.$index !== 0 ? normalizedOpacity : 1}`
      };
    },
    onUpdate({ active }) {
      this.activeCard = active;
    },
    onMove({ stack, direction, isDragging }) {
      this.stack = stack;
      this.direction = direction;
      this.isDragging = isDragging;
    }
  },
  data() {
    return {
      stack: [],
      isDragging: false,
      activeCard: {
        rating: 0
      },
      cards: [
        {
          id: 1,
          title: "The Martian",
          release: "10.2.18",
          cover: "https://assets.codepen.io/152347/the-martian.jpg",
          rating: 3,
          description:
            "A young blade runner's discovery of a long-buried secret leads him to track down former blade runner Rick Deckard, who's been missing for thirty years."
        },
        {
          id: 2,
          title: "Blade Runner 2049",
          release: "10.6.17",
          cover: "https://assets.codepen.io/152347/blade-runner.jpg",
          rating: 5,
          description:
            "A young blade runner's discovery of a long-buried secret leads him to track down former blade runner Rick Deckard, who's been missing for thirty years."
        },
        {
          id: 3,
          title: "Justice League",
          release: "10.6.17",
          cover: "https://assets.codepen.io/152347/justice-league.jpg",
          rating: 1,
          description:
            "A young blade runner's discovery of a long-buried secret leads him to track down former blade runner Rick Deckard, who's been missing for thirty years."
        },
        {
          id: 4,
          title: "Ex Machina",
          release: "10.6.17",
          cover: "https://assets.codepen.io/152347/ex-machina.jpg",
          rating: 4,
          description:
            "A young blade runner's discovery of a long-buried secret leads him to track down former blade runner Rick Deckard, who's been missing for thirty years."
        },
        {
          id: 5,
          title: "Alien",
          release: "10.6.17",
          cover: "https://assets.codepen.io/152347/alien.jpg",
          rating: 3,
          description:
            "A young blade runner's discovery of a long-buried secret leads him to track down former blade runner Rick Deckard, who's been missing for thirty years."
        },
        {
          id: 6,
          title: "Interstellar",
          release: "10.6.17",
          cover: "https://assets.codepen.io/152347/interstellar.jpg",
          rating: 5,
          description:
            "A young blade runner's discovery of a long-buried secret leads him to track down former blade runner Rick Deckard, who's been missing for thirty years."
        }
      ]
    };
  }
};

function normalizeComponent(template, style, script, scopeId, isFunctionalTemplate, moduleIdentifier /* server only */, shadowMode, createInjector, createInjectorSSR, createInjectorShadow) {
    if (typeof shadowMode !== 'boolean') {
        createInjectorSSR = createInjector;
        createInjector = shadowMode;
        shadowMode = false;
    }
    // Vue.extend constructor export interop.
    const options = typeof script === 'function' ? script.options : script;
    // render functions
    if (template && template.render) {
        options.render = template.render;
        options.staticRenderFns = template.staticRenderFns;
        options._compiled = true;
        // functional template
        if (isFunctionalTemplate) {
            options.functional = true;
        }
    }
    // scopedId
    if (scopeId) {
        options._scopeId = scopeId;
    }
    let hook;
    if (moduleIdentifier) {
        // server build
        hook = function (context) {
            // 2.3 injection
            context =
                context || // cached call
                    (this.$vnode && this.$vnode.ssrContext) || // stateful
                    (this.parent && this.parent.$vnode && this.parent.$vnode.ssrContext); // functional
            // 2.2 with runInNewContext: true
            if (!context && typeof __VUE_SSR_CONTEXT__ !== 'undefined') {
                context = __VUE_SSR_CONTEXT__;
            }
            // inject component styles
            if (style) {
                style.call(this, createInjectorSSR(context));
            }
            // register component module identifier for async chunk inference
            if (context && context._registeredComponents) {
                context._registeredComponents.add(moduleIdentifier);
            }
        };
        // used by ssr in case component is cached and beforeCreate
        // never gets called
        options._ssrRegister = hook;
    }
    else if (style) {
        hook = shadowMode
            ? function (context) {
                style.call(this, createInjectorShadow(context, this.$root.$options.shadowRoot));
            }
            : function (context) {
                style.call(this, createInjector(context));
            };
    }
    if (hook) {
        if (options.functional) {
            // register for functional component in vue file
            const originalRender = options.render;
            options.render = function renderWithStyleInjection(h, context) {
                hook.call(context);
                return originalRender(h, context);
            };
        }
        else {
            // inject component registration as beforeCreate hook
            const existing = options.beforeCreate;
            options.beforeCreate = existing ? [].concat(existing, hook) : [hook];
        }
    }
    return script;
}

const isOldIE = typeof navigator !== 'undefined' &&
    /msie [6-9]\\b/.test(navigator.userAgent.toLowerCase());
function createInjector(context) {
    return (id, style) => addStyle(id, style);
}
let HEAD;
const styles = {};
function addStyle(id, css) {
    const group = isOldIE ? css.media || 'default' : id;
    const style = styles[group] || (styles[group] = { ids: new Set(), styles: [] });
    if (!style.ids.has(id)) {
        style.ids.add(id);
        let code = css.source;
        if (css.map) {
            // https://developer.chrome.com/devtools/docs/javascript-debugging
            // this makes source maps inside style tags work properly in Chrome
            code += '\n/*# sourceURL=' + css.map.sources[0] + ' */';
            // http://stackoverflow.com/a/26603875
            code +=
                '\n/*# sourceMappingURL=data:application/json;base64,' +
                    btoa(unescape(encodeURIComponent(JSON.stringify(css.map)))) +
                    ' */';
        }
        if (!style.element) {
            style.element = document.createElement('style');
            style.element.type = 'text/css';
            if (css.media)
                style.element.setAttribute('media', css.media);
            if (HEAD === undefined) {
                HEAD = document.head || document.getElementsByTagName('head')[0];
            }
            HEAD.appendChild(style.element);
        }
        if ('styleSheet' in style.element) {
            style.styles.push(code);
            style.element.styleSheet.cssText = style.styles
                .filter(Boolean)
                .join('\n');
        }
        else {
            const index = style.ids.size - 1;
            const textNode = document.createTextNode(code);
            const nodes = style.element.childNodes;
            if (nodes[index])
                style.element.removeChild(nodes[index]);
            if (nodes.length)
                style.element.insertBefore(textNode, nodes[index]);
            else
                style.element.appendChild(textNode);
        }
    }
}

/* script */
const __vue_script__ = script;

/* template */
var __vue_render__ = function() {
  var _vm = this;
  var _h = _vm.$createElement;
  var _c = _vm._self._c || _h;
  return _c("div", { attrs: { id: "app" } }, [
    _c("div", { staticClass: "container" }, [
      _vm._m(0),
      _vm._v(" "),
      _c(
        "div",
        { staticClass: "stack" },
        [
          _c("VueCardStack", {
            attrs: {
              cards: _vm.cards,
              cardWidth: 286,
              cardHeight: 458,
              stackWidth: "100%"
            },
            on: { move: _vm.onMove, update: _vm.onUpdate },
            scopedSlots: _vm._u([
              {
                key: "card",
                fn: function(ref) {
                  var card = ref.card;
                  return [
                    _c("div", { staticClass: "card" }, [
                      _c("img", {
                        style: Object.assign({}, _vm.getStyles(card), {
                          transition: card.isDragging ? "none" : "all 0.2s"
                        }),
                        attrs: {
                          onmousedown: "event.preventDefault()",
                          draggable: "false",
                          src: card.cover
                        }
                      })
                    ])
                  ]
                }
              }
            ])
          })
        ],
        1
      ),
      _vm._v(" "),
      _c(
        "footer",
        { staticClass: "footer" },
        [
          _vm._l(_vm.cards, function(card, index) {
            return _c(
              "div",
              {
                key: index,
                staticClass: "info",
                style: _vm.getInfoStyles[index]
              },
              [
                _c("h2", { staticClass: "title" }, [
                  _vm._v(_vm._s(card.title))
                ]),
                _vm._v(" "),
                _c("h3", { staticClass: "date" }, [
                  _vm._v("\n          Coming in\n          "),
                  _c("span", [_vm._v(_vm._s(card.release))])
                ])
              ]
            )
          }),
          _vm._v(" "),
          _c(
            "div",
            { staticClass: "rating" },
            _vm._l(5, function(x) {
              return _c("div", {
                key: x,
                staticClass: "star",
                class: { active: x <= _vm.activeCard.rating }
              })
            }),
            0
          )
        ],
        2
      )
    ]),
    _vm._v(" "),
    _c("div", { staticClass: "try-me" }, [
      _c(
        "svg",
        { attrs: { viewBox: "0 0 24 24", width: "20", height: "20" } },
        [
          _c("path", {
            attrs: {
              d:
                "M13.5091 24.0063C10.7699 23.971 8.15366 22.8634 6.22167 20.9213C6.03942 20.7406 5.88216 20.5364 5.75406 20.314L1.88564 13.6338C1.84853 13.569 1.81995 13.4996 1.80062 13.4274C1.64142 12.893 1.66621 12.3206 1.87102 11.802C2.07583 11.2833 2.4488 10.8485 2.93017 10.567C3.29921 10.353 3.71811 10.2399 4.14475 10.2391V10.2391L0.179159 3.3646C0.141029 3.30022 0.112394 3.23068 0.0941387 3.15812C-0.05595 2.62723 -0.0259149 2.06157 0.179549 1.54956C0.385013 1.03755 0.754327 0.608036 1.22977 0.328161C1.71192 0.0542366 2.27111 -0.0525986 2.82028 0.0242861C3.36946 0.101171 3.87781 0.357462 4.2662 0.753262C4.31781 0.806246 4.36269 0.865397 4.39981 0.929376L7.76418 6.75934C7.97368 6.39282 8.27508 6.08723 8.63867 5.8727C9.07352 5.62113 9.57567 5.51057 10.076 5.55624C10.5763 5.60192 11.0501 5.80159 11.4322 6.12776C11.6456 5.69776 11.9816 5.34063 12.3978 5.10144C12.8357 4.85175 13.3405 4.74449 13.8421 4.79455C14.3438 4.8446 14.8174 5.04948 15.1974 5.38079C15.4098 4.94855 15.7459 4.58921 16.163 4.3484C16.6459 4.07256 17.2073 3.96635 17.7576 4.0467C18.3079 4.12704 18.8155 4.38933 19.1994 4.79172C19.2523 4.84132 19.2973 4.89865 19.333 4.96177L22.5881 10.6035C22.718 10.8241 22.8181 11.061 22.8856 11.3079C24.1002 16.1662 22.1265 20.5448 18.3674 22.7189C16.8889 23.5667 15.2134 24.0107 13.5091 24.0063ZM4.14475 11.6601C3.93233 11.6614 3.72358 11.7157 3.53746 11.818C3.39879 11.8979 3.27727 12.0044 3.17988 12.1313C3.08248 12.2583 3.01114 12.4033 2.96994 12.5579C2.92875 12.7125 2.91851 12.8737 2.93983 13.0323C2.96114 13.1909 3.01358 13.3437 3.09414 13.482L6.13058 18.7411C7.25801 20.694 9.11506 22.119 11.2932 22.7027C12.3717 22.9917 13.4965 23.0655 14.6035 22.9198C15.7105 22.774 16.778 22.4117 17.7449 21.8535C18.7119 21.2952 19.5595 20.552 20.2392 19.6662C20.9189 18.7804 21.4175 17.7694 21.7065 16.6909C21.9955 15.6124 22.0693 14.4875 21.9236 13.3805C21.7779 12.2735 21.4155 11.2061 20.8573 10.2391L18.4281 6.03059C18.2601 5.76622 17.9964 5.57701 17.6921 5.50248C17.3878 5.42795 17.0665 5.47387 16.7953 5.63064C16.5241 5.78741 16.324 6.04291 16.2367 6.34377C16.1494 6.64464 16.1817 6.96759 16.3269 7.24517C16.4075 7.38529 16.429 7.55167 16.3869 7.70769C16.3448 7.86372 16.2424 7.99662 16.1022 8.07715C15.9621 8.15768 15.7957 8.17925 15.6397 8.13711C15.4837 8.09497 15.3508 7.99258 15.2703 7.85245L14.663 6.80185C14.5857 6.66179 14.4806 6.53895 14.3543 6.4408C14.228 6.34266 14.083 6.27127 13.9281 6.231C13.6162 6.15185 13.2859 6.19532 13.0051 6.35245C12.8668 6.4327 12.7457 6.53946 12.6488 6.6666C12.5519 6.79374 12.481 6.93876 12.4403 7.09334C12.3988 7.24763 12.3882 7.40859 12.4091 7.56698C12.4299 7.72538 12.4818 7.87811 12.5617 8.01642C12.6344 8.15521 12.6505 8.31669 12.6069 8.46712C12.5632 8.61755 12.4632 8.7453 12.3276 8.82368C12.1919 8.90207 12.0313 8.92503 11.8792 8.88776C11.727 8.8505 11.5952 8.75589 11.5111 8.62371V8.62371L10.9039 7.56703C10.8236 7.42876 10.7169 7.3077 10.5897 7.21078C10.4626 7.11386 10.3175 7.043 10.163 7.00225C9.85324 6.9202 9.52364 6.96385 9.24596 7.12371C9.10657 7.20335 8.98434 7.30983 8.88636 7.437C8.78837 7.56417 8.71657 7.70951 8.67511 7.8646C8.59306 8.17432 8.63671 8.50392 8.79657 8.7816V8.7816C8.86917 8.92039 8.88534 9.08187 8.8417 9.2323C8.79806 9.38273 8.69798 9.51048 8.56237 9.58887C8.42676 9.66725 8.26611 9.69021 8.11398 9.65295C7.96184 9.61568 7.82999 9.52108 7.74596 9.38889L3.49495 2.02857C3.33368 1.75015 3.06853 1.54709 2.7577 1.46398C2.44687 1.38086 2.11576 1.42447 1.83705 1.58525C1.69691 1.66755 1.57472 1.77715 1.47771 1.90754C1.38069 2.03794 1.31084 2.18647 1.27228 2.34436C1.23082 2.49864 1.2202 2.6596 1.24105 2.81799C1.26189 2.97639 1.31377 3.12912 1.39373 3.26743L6.25203 11.648V11.6844L8.37754 15.3646C8.41769 15.4339 8.44374 15.5105 8.45417 15.5899C8.46461 15.6693 8.45923 15.75 8.43834 15.8274C8.41746 15.9047 8.38148 15.9771 8.33248 16.0405C8.28348 16.1039 8.22243 16.1569 8.15284 16.1966C8.08131 16.2387 8.0019 16.2658 7.91951 16.276C7.83712 16.2863 7.7535 16.2795 7.67382 16.2562C7.59414 16.2329 7.52009 16.1934 7.45625 16.1404C7.39241 16.0873 7.34013 16.0217 7.30264 15.9476L5.18321 12.2431C5.02183 11.9746 4.76291 11.7787 4.46054 11.6966C4.35706 11.6721 4.25107 11.6599 4.14475 11.6601V11.6601Z",
              fill: "currentColor"
            }
          })
        ]
      ),
      _vm._v(" "),
      _c("p", [_vm._v("Try Me")])
    ]),
    _vm._v(" "),
    _vm._m(1)
  ])
};
var __vue_staticRenderFns__ = [
  function() {
    var _vm = this;
    var _h = _vm.$createElement;
    var _c = _vm._self._c || _h;
    return _c("header", { staticClass: "header" }, [
      _c("h1", { staticClass: "logo" }, [
        _vm._v("\n        Movies\n        "),
        _c("div", { staticClass: "period" })
      ]),
      _vm._v(" "),
      _c("div", { staticClass: "avatar" })
    ])
  },
  function() {
    var _vm = this;
    var _h = _vm.$createElement;
    var _c = _vm._self._c || _h;
    return _c(
      "a",
      {
        staticClass: "attribution",
        attrs: {
          href:
            "https://dribbble.com/shots/3982621-InVision-Studio-Movies-app-concept",
          target: "_blank"
        }
      },
      [
        _c("img", {
          attrs: {
            src: "https://assets.codepen.io/152347/dribbble.svg?abc",
            alt: ""
          }
        }),
        _vm._v(" "),
        _c("div", { staticClass: "inner" }, [
          _c("h3", [_vm._v("Charles Patterson")]),
          _vm._v(" "),
          _c("h5", [_vm._v("Movies app concept")])
        ])
      ]
    )
  }
];
__vue_render__._withStripped = true;

  /* style */
  const __vue_inject_styles__ = function (inject) {
    if (!inject) return
    inject("data-v-28092164_0", { source: "@font-face {\n  font-family: \"Eina\";\n  src: url(\"https://assets.codepen.io/152347/eina-03-semibold.woff2\") format(\"woff2\"), url(\"https://assets.codepen.io/152347/eina-03-semibold.woff\") format(\"woff\");\n}\nbody {\n  font-family: \"Eina\", serif;\n  -webkit-font-smoothing: antialiased;\n  -moz-osx-font-smoothing: grayscale;\n  background: #9796f0;\n  /* fallback for old browsers */\n  background: -webkit-linear-gradient(to right, #fbc7d4, #9796f0);\n  /* Chrome 10-25, Safari 5.1-6 */\n  background: linear-gradient(to right, #fbc7d4, #9796f0);\n  /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */\n}\n#app {\n  color: #1c1c1c;\n  display: flex;\n  flex-direction: column;\n  justify-content: center;\n  align-items: center;\n  height: 100vh;\n  grid-gap: 60px;\n}\n.attribution {\n  text-decoration: none;\n  width: auto;\n  border-radius: 999em;\n  border: 1px solid rgba(255, 255, 255, 0.15);\n  padding: 12px 25px 12px 60px;\n  height: 30px;\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  color: #1c1c1c;\n  background: #fff;\n  background: rgba(255, 255, 255, 0.25);\n  position: relative;\n  font-family: \"Montserrat\", sans-serif;\n}\n.attribution > img {\n  color: green;\n  width: 40px;\n  height: 40px;\n  position: absolute;\n  left: 8px;\n  top: 50%;\n  transform: translate(0, -50%);\n}\n.attribution .inner {\n  display: flex;\n  flex-direction: column;\n  grid-gap: 2px;\n}\n.attribution h3 {\n  font-size: 11px;\n}\n.attribution h5 {\n  font-size: 16px;\n  font-weight: 600;\n}\n.container {\n  z-index: 2;\n  position: relative;\n  background: #fff;\n  border-radius: 12px;\n  width: 375px;\n  height: 667px;\n  overflow: hidden;\n  box-shadow: 0 70px 63px -60px;\n  display: flex;\n  flex-direction: column;\n}\n.header {\n  display: flex;\n  justify-content: space-between;\n  padding: 24px;\n}\n.header .logo {\n  align-items: baseline;\n  display: flex;\n  font-size: 29px;\n}\n.header .period {\n  width: 5px;\n  height: 5px;\n  margin-left: 4px;\n  background: #ff3366;\n}\n.header .avatar {\n  width: 32px;\n  height: 32px;\n  border-radius: 20px;\n  background: #ffe259;\n  overflow: hidden;\n}\n.header .avatar > img {\n  width: 100%;\n  height: auto;\n}\n.footer {\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n  padding: 24px;\n  flex-direction: row-reverse;\n  position: relative;\n}\n.rating {\n  display: flex;\n  justify-content: space-between;\n  justify-self: flex-end;\n}\n.rating .star {\n  background: url(\"https://assets.codepen.io/152347/star.svg\");\n  background-size: 100%;\n  width: 15px;\n  height: 15px;\n  transform: scale(0.5, 0.5);\n  margin: 2px;\n  transition: all 0.2s ease;\n  opacity: 0.5;\n}\n.rating .star.active {\n  transform: scale(1, 1);\n  opacity: 1;\n}\n.info {\n  position: absolute;\n  left: 24px;\n}\n.info .title {\n  font-size: 16px;\n  line-height: 22px;\n}\n.info .date {\n  font-size: 11px;\n  line-height: 15px;\n  color: #9ba7c6;\n}\n.stack {\n  width: 100%;\n}\n.card {\n  width: 100%;\n  height: 100%;\n  border-radius: 8px;\n  overflow: hidden;\n  transform: rotate(0);\n  background: #fff;\n  -webkit-user-select: none;\n  -khtml-user-select: none;\n  -moz-user-select: none;\n  -o-user-select: none;\n  user-select: none;\n}\n.card > img {\n  width: 286px;\n  height: 458px;\n  object-fit: cover;\n  -webkit-user-select: none;\n  -khtml-user-select: none;\n  -moz-user-select: none;\n  -o-user-select: none;\n  user-select: none;\n}\n.try-me {\n  display: flex;\n  grid-gap: 8px;\n  align-items: center;\n  font-size: 14px;\n  margin-top: -24px;\n  font-family: \"Montserrat\", sans-serif;\n  font-weight: 600;\n  color: #fff;\n}\n\n/*# sourceMappingURL=pen.vue.map */", map: {"version":3,"sources":["/tmp/codepen/vuejs/src/pen.vue","pen.vue"],"names":[],"mappings":"AA8RA;EACA,mBAAA;EACA,iKAAA;AC7RA;ADkSA;EACA,0BAAA;EACA,mCAAA;EACA,kCAAA;EACA,mBAAA;EAAA,8BAAA;EACA,+DAAA;EAIA,+BAAA;EACA,uDAAA;EAIA,qEAAA;ACrSA;ADwSA;EACA,cAAA;EACA,aAAA;EACA,sBAAA;EACA,uBAAA;EACA,mBAAA;EACA,aAAA;EACA,cAAA;ACrSA;ADwSA;EACA,qBAAA;EACA,WAAA;EACA,oBAAA;EACA,2CAAA;EACA,4BAAA;EACA,YAAA;EACA,aAAA;EACA,uBAAA;EACA,mBAAA;EACA,cAAA;EACA,gBAAA;EACA,qCAAA;EACA,kBAAA;EACA,qCAAA;ACrSA;ADuSA;EACA,YAAA;EACA,WAAA;EACA,YAAA;EACA,kBAAA;EACA,SAAA;EACA,QAAA;EACA,6BAAA;ACrSA;ADwSA;EACA,aAAA;EACA,sBAAA;EACA,aAAA;ACtSA;ADySA;EACA,eAAA;ACvSA;AD0SA;EACA,eAAA;EACA,gBAAA;ACxSA;AD4SA;EACA,UAAA;EACA,kBAAA;EACA,gBAAA;EACA,mBAAA;EACA,YAAA;EACA,aAAA;EACA,gBAAA;EACA,6BAAA;EACA,aAAA;EACA,sBAAA;ACzSA;AD+SA;EACA,aAAA;EACA,8BAAA;EACA,aAAA;AC5SA;AD8SA;EACA,qBAAA;EACA,aAAA;EACA,eAAA;AC5SA;AD+SA;EACA,UAAA;EACA,WAAA;EACA,gBAAA;EACA,mBAAA;AC7SA;ADgTA;EACA,WAAA;EACA,YAAA;EACA,mBAAA;EACA,mBAAA;EACA,gBAAA;AC9SA;ADiTA;EACA,WAAA;EACA,YAAA;AC/SA;ADsTA;EACA,aAAA;EACA,8BAAA;EACA,mBAAA;EACA,aAAA;EACA,2BAAA;EACA,kBAAA;ACnTA;ADyTA;EACA,aAAA;EACA,8BAAA;EACA,sBAAA;ACtTA;ADwTA;EACA,4DAAA;EACA,qBAAA;EACA,WAAA;EACA,YAAA;EACA,0BAAA;EACA,WAAA;EACA,yBAAA;EACA,YAAA;ACtTA;ADwTA;EACA,sBAAA;EACA,UAAA;ACtTA;AD8TA;EACA,kBAAA;EACA,UAAA;AC3TA;AD6TA;EACA,eAAA;EACA,iBAAA;AC3TA;AD8TA;EACA,eAAA;EACA,iBAAA;EACA,cAAA;AC5TA;ADgUA;EACA,WAAA;AC7TA;ADgUA;EACA,WAAA;EACA,YAAA;EACA,kBAAA;EACA,gBAAA;EACA,oBAAA;EACA,gBAAA;EACA,yBAAA;EACA,wBAAA;EACA,sBAAA;EACA,oBAAA;EACA,iBAAA;AC7TA;AD+TA;EACA,YAAA;EACA,aAAA;EACA,iBAAA;EACA,yBAAA;EACA,wBAAA;EACA,sBAAA;EACA,oBAAA;EACA,iBAAA;AC7TA;ADiUA;EACA,aAAA;EACA,aAAA;EACA,mBAAA;EACA,eAAA;EACA,iBAAA;EACA,qCAAA;EACA,gBAAA;EACA,WAAA;AC9TA;;AAEA,kCAAkC","file":"pen.vue","sourcesContent":["<template>\n  <div id=\"app\">\n    <div class=\"container\">\n      <header class=\"header\">\n        <h1 class=\"logo\">\n          Movies\n          <div class=\"period\"></div>\n        </h1>\n\n        <div class=\"avatar\"></div>\n      </header>\n\n      <div class=\"stack\">\n        <VueCardStack\n          :cards=\"cards\"\n          :cardWidth=\"286\"\n          :cardHeight=\"458\"\n          stackWidth=\"100%\"\n          @move=\"onMove\"\n          @update=\"onUpdate\"\n        >\n          <template v-slot:card=\"{ card }\">\n            <div class=\"card\">\n              <img\n                onmousedown=\"event.preventDefault()\"\n                draggable=\"false\"\n                :src=\"card.cover\"\n                :style=\"{\n                  ...getStyles(card),\n                  transition: card.isDragging ? 'none' : 'all 0.2s'\n                }\"\n              />\n            </div>\n          </template>\n        </VueCardStack>\n      </div>\n\n      <footer class=\"footer\">\n        <div\n          class=\"info\"\n          v-for=\"(card, index) in cards\"\n          :key=\"index\"\n          :style=\"getInfoStyles[index]\"\n        >\n          <h2 class=\"title\">{{ card.title }}</h2>\n          <h3 class=\"date\">\n            Coming in\n            <span>{{ card.release }}</span>\n          </h3>\n        </div>\n        <div class=\"rating\">\n          <div\n            v-for=\"x in 5\"\n            :key=\"x\"\n            class=\"star\"\n            v-bind:class=\"{ active: x <= activeCard.rating }\"\n          />\n        </div>\n      </footer>\n    </div>\n\n    <div class=\"try-me\">\n      <svg viewBox=\"0 0 24 24\" width=\"20\" height=\"20\">\n        <path\n          d=\"M13.5091 24.0063C10.7699 23.971 8.15366 22.8634 6.22167 20.9213C6.03942 20.7406 5.88216 20.5364 5.75406 20.314L1.88564 13.6338C1.84853 13.569 1.81995 13.4996 1.80062 13.4274C1.64142 12.893 1.66621 12.3206 1.87102 11.802C2.07583 11.2833 2.4488 10.8485 2.93017 10.567C3.29921 10.353 3.71811 10.2399 4.14475 10.2391V10.2391L0.179159 3.3646C0.141029 3.30022 0.112394 3.23068 0.0941387 3.15812C-0.05595 2.62723 -0.0259149 2.06157 0.179549 1.54956C0.385013 1.03755 0.754327 0.608036 1.22977 0.328161C1.71192 0.0542366 2.27111 -0.0525986 2.82028 0.0242861C3.36946 0.101171 3.87781 0.357462 4.2662 0.753262C4.31781 0.806246 4.36269 0.865397 4.39981 0.929376L7.76418 6.75934C7.97368 6.39282 8.27508 6.08723 8.63867 5.8727C9.07352 5.62113 9.57567 5.51057 10.076 5.55624C10.5763 5.60192 11.0501 5.80159 11.4322 6.12776C11.6456 5.69776 11.9816 5.34063 12.3978 5.10144C12.8357 4.85175 13.3405 4.74449 13.8421 4.79455C14.3438 4.8446 14.8174 5.04948 15.1974 5.38079C15.4098 4.94855 15.7459 4.58921 16.163 4.3484C16.6459 4.07256 17.2073 3.96635 17.7576 4.0467C18.3079 4.12704 18.8155 4.38933 19.1994 4.79172C19.2523 4.84132 19.2973 4.89865 19.333 4.96177L22.5881 10.6035C22.718 10.8241 22.8181 11.061 22.8856 11.3079C24.1002 16.1662 22.1265 20.5448 18.3674 22.7189C16.8889 23.5667 15.2134 24.0107 13.5091 24.0063ZM4.14475 11.6601C3.93233 11.6614 3.72358 11.7157 3.53746 11.818C3.39879 11.8979 3.27727 12.0044 3.17988 12.1313C3.08248 12.2583 3.01114 12.4033 2.96994 12.5579C2.92875 12.7125 2.91851 12.8737 2.93983 13.0323C2.96114 13.1909 3.01358 13.3437 3.09414 13.482L6.13058 18.7411C7.25801 20.694 9.11506 22.119 11.2932 22.7027C12.3717 22.9917 13.4965 23.0655 14.6035 22.9198C15.7105 22.774 16.778 22.4117 17.7449 21.8535C18.7119 21.2952 19.5595 20.552 20.2392 19.6662C20.9189 18.7804 21.4175 17.7694 21.7065 16.6909C21.9955 15.6124 22.0693 14.4875 21.9236 13.3805C21.7779 12.2735 21.4155 11.2061 20.8573 10.2391L18.4281 6.03059C18.2601 5.76622 17.9964 5.57701 17.6921 5.50248C17.3878 5.42795 17.0665 5.47387 16.7953 5.63064C16.5241 5.78741 16.324 6.04291 16.2367 6.34377C16.1494 6.64464 16.1817 6.96759 16.3269 7.24517C16.4075 7.38529 16.429 7.55167 16.3869 7.70769C16.3448 7.86372 16.2424 7.99662 16.1022 8.07715C15.9621 8.15768 15.7957 8.17925 15.6397 8.13711C15.4837 8.09497 15.3508 7.99258 15.2703 7.85245L14.663 6.80185C14.5857 6.66179 14.4806 6.53895 14.3543 6.4408C14.228 6.34266 14.083 6.27127 13.9281 6.231C13.6162 6.15185 13.2859 6.19532 13.0051 6.35245C12.8668 6.4327 12.7457 6.53946 12.6488 6.6666C12.5519 6.79374 12.481 6.93876 12.4403 7.09334C12.3988 7.24763 12.3882 7.40859 12.4091 7.56698C12.4299 7.72538 12.4818 7.87811 12.5617 8.01642C12.6344 8.15521 12.6505 8.31669 12.6069 8.46712C12.5632 8.61755 12.4632 8.7453 12.3276 8.82368C12.1919 8.90207 12.0313 8.92503 11.8792 8.88776C11.727 8.8505 11.5952 8.75589 11.5111 8.62371V8.62371L10.9039 7.56703C10.8236 7.42876 10.7169 7.3077 10.5897 7.21078C10.4626 7.11386 10.3175 7.043 10.163 7.00225C9.85324 6.9202 9.52364 6.96385 9.24596 7.12371C9.10657 7.20335 8.98434 7.30983 8.88636 7.437C8.78837 7.56417 8.71657 7.70951 8.67511 7.8646C8.59306 8.17432 8.63671 8.50392 8.79657 8.7816V8.7816C8.86917 8.92039 8.88534 9.08187 8.8417 9.2323C8.79806 9.38273 8.69798 9.51048 8.56237 9.58887C8.42676 9.66725 8.26611 9.69021 8.11398 9.65295C7.96184 9.61568 7.82999 9.52108 7.74596 9.38889L3.49495 2.02857C3.33368 1.75015 3.06853 1.54709 2.7577 1.46398C2.44687 1.38086 2.11576 1.42447 1.83705 1.58525C1.69691 1.66755 1.57472 1.77715 1.47771 1.90754C1.38069 2.03794 1.31084 2.18647 1.27228 2.34436C1.23082 2.49864 1.2202 2.6596 1.24105 2.81799C1.26189 2.97639 1.31377 3.12912 1.39373 3.26743L6.25203 11.648V11.6844L8.37754 15.3646C8.41769 15.4339 8.44374 15.5105 8.45417 15.5899C8.46461 15.6693 8.45923 15.75 8.43834 15.8274C8.41746 15.9047 8.38148 15.9771 8.33248 16.0405C8.28348 16.1039 8.22243 16.1569 8.15284 16.1966C8.08131 16.2387 8.0019 16.2658 7.91951 16.276C7.83712 16.2863 7.7535 16.2795 7.67382 16.2562C7.59414 16.2329 7.52009 16.1934 7.45625 16.1404C7.39241 16.0873 7.34013 16.0217 7.30264 15.9476L5.18321 12.2431C5.02183 11.9746 4.76291 11.7787 4.46054 11.6966C4.35706 11.6721 4.25107 11.6599 4.14475 11.6601V11.6601Z\"\n          fill=\"currentColor\"\n        />\n      </svg>\n      <p>Try Me</p>\n    </div>\n\n    <a\n      class=\"attribution\"\n      href=\"https://dribbble.com/shots/3982621-InVision-Studio-Movies-app-concept\"\n      target=\"_blank\"\n    >\n      <img src=\"https://assets.codepen.io/152347/dribbble.svg?abc\" alt=\"\" />\n      <div class=\"inner\">\n        <h3>Charles Patterson</h3>\n        <h5>Movies app concept</h5>\n      </div>\n    </a>\n  </div>\n</template>\n\n<script>\nimport VueCardStack from \"https://assets.codepen.io/152347/vue-card-stack.esm.js?skahdfjahj\";\n\nexport default {\n  components: {\n    VueCardStack\n  },\n  computed: {\n    getInfoStyles() {\n      const SPEED = 0.25;\n\n      if (this.stack.length) {\n        const styles = this.cards.map((card, index) => {\n          const cardInStack = this.stack.find((x) => x.id === card.id);\n          const cardIndexInStack = this.stack.findIndex(\n            (x) => x.id === card.id\n          );\n\n          const yPosFactor = this.convertRange(\n            cardInStack.xPos,\n            [0, 69],\n            [1, 0]\n          );\n\n          if (this.direction === \"left\") {\n            const o = (i) => {\n              if (this.isDragging) {\n                if (i === 0) {\n                  return this.convertRange(cardInStack.xPos, [380, 69], [0, 1]);\n                } else if (i === 1) {\n                  return this.convertRange(cardInStack.xPos, [69, 65], [1, 0]);\n                } else {\n                  return 0;\n                }\n              } else {\n                return i === 1 ? 1 : 0;\n              }\n            };\n\n            return {\n              transform: `translate(0, ${\n                cardIndexInStack === 0\n                  ? 5 * yPosFactor\n                  : (cardIndexInStack + 1) * (100 * yPosFactor)\n              }px)`,\n              transition: `transform ${\n                this.isDragging && !(cardIndexInStack > 1) ? 0 : SPEED\n              }s ease 0s, opacity ${this.isDragging ? 0 : SPEED}s ease 0s`,\n              opacity: o(cardIndexInStack)\n            };\n          } else {\n            const o = (i) => {\n              if (this.isDragging) {\n                if (i === 1) {\n                  return this.convertRange(cardInStack.xPos, [69, 200], [1, 0]);\n                } else if (i === 2) {\n                  return this.convertRange(cardInStack.xPos, [55, 69], [0, 1]);\n                } else {\n                  return 0;\n                }\n              } else {\n                return i === 1 ? 1 : 0;\n              }\n            };\n\n            return {\n              transform: `translate(0, ${\n                cardIndexInStack === 1\n                  ? 5 * yPosFactor\n                  : (cardIndexInStack - 1) * (100 * yPosFactor)\n              }px)`,\n              transition: `transform ${\n                this.isDragging && !(cardIndexInStack > 2) ? 0 : SPEED\n              }s ease 0s, opacity ${this.isDragging ? 0 : SPEED}s ease 0s`,\n              opacity: o(cardIndexInStack)\n            };\n          }\n        });\n\n        return styles;\n      }\n\n      return {};\n    }\n  },\n  methods: {\n    convertRange(value, r1, r2) {\n      return ((value - r1[0]) * (r2[1] - r2[0])) / (r1[1] - r1[0]) + r2[0];\n    },\n    getStyles(card) {\n      const MIN_POS_X = 0;\n      const MAX_POS_X = 69;\n      const MIN_SCALE_FACTOR = 1;\n      const MAX_SCALE_FACTOR = 2.5;\n\n      const opacity = this.convertRange(\n        card.xPos > 0 ? card.xPos : 0,\n        [MIN_POS_X, MAX_POS_X],\n        [0, 1]\n      );\n\n      const scale = this.convertRange(\n        card.xPos > 0 ? card.xPos : 0,\n        [MIN_POS_X, MAX_POS_X],\n        [MAX_SCALE_FACTOR, 1]\n      );\n\n      const normalizedScale =\n        scale >= MIN_SCALE_FACTOR\n          ? scale <= MAX_SCALE_FACTOR\n            ? scale\n            : MAX_SCALE_FACTOR\n          : MIN_SCALE_FACTOR;\n\n      const normalizedOpacity = opacity >= 0 ? (opacity <= 1 ? opacity : 1) : 0;\n\n      return {\n        transform: `scale(${card.$index !== 0 ? normalizedScale : 1}, ${\n          card.$index !== 0 ? normalizedScale : MIN_SCALE_FACTOR\n        })`,\n        opacity: `${card.$index !== 0 ? normalizedOpacity : 1}`\n      };\n    },\n    onUpdate({ active }) {\n      this.activeCard = active;\n    },\n    onMove({ stack, direction, isDragging }) {\n      this.stack = stack;\n      this.direction = direction;\n      this.isDragging = isDragging;\n    }\n  },\n  data() {\n    return {\n      stack: [],\n      isDragging: false,\n      activeCard: {\n        rating: 0\n      },\n      cards: [\n        {\n          id: 1,\n          title: \"The Martian\",\n          release: \"10.2.18\",\n          cover: \"https://assets.codepen.io/152347/the-martian.jpg\",\n          rating: 3,\n          description:\n            \"A young blade runner's discovery of a long-buried secret leads him to track down former blade runner Rick Deckard, who's been missing for thirty years.\"\n        },\n        {\n          id: 2,\n          title: \"Blade Runner 2049\",\n          release: \"10.6.17\",\n          cover: \"https://assets.codepen.io/152347/blade-runner.jpg\",\n          rating: 5,\n          description:\n            \"A young blade runner's discovery of a long-buried secret leads him to track down former blade runner Rick Deckard, who's been missing for thirty years.\"\n        },\n        {\n          id: 3,\n          title: \"Justice League\",\n          release: \"10.6.17\",\n          cover: \"https://assets.codepen.io/152347/justice-league.jpg\",\n          rating: 1,\n          description:\n            \"A young blade runner's discovery of a long-buried secret leads him to track down former blade runner Rick Deckard, who's been missing for thirty years.\"\n        },\n        {\n          id: 4,\n          title: \"Ex Machina\",\n          release: \"10.6.17\",\n          cover: \"https://assets.codepen.io/152347/ex-machina.jpg\",\n          rating: 4,\n          description:\n            \"A young blade runner's discovery of a long-buried secret leads him to track down former blade runner Rick Deckard, who's been missing for thirty years.\"\n        },\n        {\n          id: 5,\n          title: \"Alien\",\n          release: \"10.6.17\",\n          cover: \"https://assets.codepen.io/152347/alien.jpg\",\n          rating: 3,\n          description:\n            \"A young blade runner's discovery of a long-buried secret leads him to track down former blade runner Rick Deckard, who's been missing for thirty years.\"\n        },\n        {\n          id: 6,\n          title: \"Interstellar\",\n          release: \"10.6.17\",\n          cover: \"https://assets.codepen.io/152347/interstellar.jpg\",\n          rating: 5,\n          description:\n            \"A young blade runner's discovery of a long-buried secret leads him to track down former blade runner Rick Deckard, who's been missing for thirty years.\"\n        }\n      ]\n    };\n  }\n};\n</script>\n\n<style lang=\"scss\">\n@font-face {\n  font-family: \"Eina\";\n  src: url(\"https://assets.codepen.io/152347/eina-03-semibold.woff2\")\n      format(\"woff2\"),\n    url(\"https://assets.codepen.io/152347/eina-03-semibold.woff\") format(\"woff\");\n}\n\nbody {\n  font-family: \"Eina\", serif;\n  -webkit-font-smoothing: antialiased;\n  -moz-osx-font-smoothing: grayscale;\n  background: #9796f0; /* fallback for old browsers */\n  background: -webkit-linear-gradient(\n    to right,\n    #fbc7d4,\n    #9796f0\n  ); /* Chrome 10-25, Safari 5.1-6 */\n  background: linear-gradient(\n    to right,\n    #fbc7d4,\n    #9796f0\n  ); /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */\n}\n\n#app {\n  color: #1c1c1c;\n  display: flex;\n  flex-direction: column;\n  justify-content: center;\n  align-items: center;\n  height: 100vh;\n  grid-gap: 60px;\n}\n\n.attribution {\n  text-decoration: none;\n  width: auto;\n  border-radius: 999em;\n  border: 1px solid rgba(255, 255, 255, 0.15);\n  padding: 12px 25px 12px 60px;\n  height: 30px;\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  color: #1c1c1c;\n  background: #fff;\n  background: rgba(255, 255, 255, 0.25);\n  position: relative;\n  font-family: \"Montserrat\", sans-serif;\n\n  > img {\n    color: green;\n    width: 40px;\n    height: 40px;\n    position: absolute;\n    left: 8px;\n    top: 50%;\n    transform: translate(0, -50%);\n  }\n\n  .inner {\n    display: flex;\n    flex-direction: column;\n    grid-gap: 2px;\n  }\n\n  h3 {\n    font-size: 11px;\n  }\n\n  h5 {\n    font-size: 16px;\n    font-weight: 600;\n  }\n}\n\n.container {\n  z-index: 2;\n  position: relative;\n  background: #fff;\n  border-radius: 12px;\n  width: 375px;\n  height: 667px;\n  overflow: hidden;\n  box-shadow: 0 70px 63px -60px;\n  display: flex;\n  flex-direction: column;\n}\n\n//////////////////////////////////////////\n// HEADER\n//////////////////////////////////////////\n.header {\n  display: flex;\n  justify-content: space-between;\n  padding: 24px;\n\n  .logo {\n    align-items: baseline;\n    display: flex;\n    font-size: 29px;\n  }\n\n  .period {\n    width: 5px;\n    height: 5px;\n    margin-left: 4px;\n    background: #ff3366;\n  }\n\n  .avatar {\n    width: 32px;\n    height: 32px;\n    border-radius: 20px;\n    background: #ffe259;\n    overflow: hidden;\n  }\n\n  .avatar > img {\n    width: 100%;\n    height: auto;\n  }\n}\n\n//////////////////////////////////////////\n// FOOTER\n//////////////////////////////////////////\n.footer {\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n  padding: 24px;\n  flex-direction: row-reverse;\n  position: relative;\n}\n\n//////////////////////////////////////////\n// RATING\n//////////////////////////////////////////\n.rating {\n  display: flex;\n  justify-content: space-between;\n  justify-self: flex-end;\n\n  .star {\n    background: url(\"https://assets.codepen.io/152347/star.svg\");\n    background-size: 100%;\n    width: 15px;\n    height: 15px;\n    transform: scale(0.5, 0.5);\n    margin: 2px;\n    transition: all 0.2s ease;\n    opacity: 0.5;\n\n    &.active {\n      transform: scale(1, 1);\n      opacity: 1;\n    }\n  }\n}\n\n//////////////////////////////////////////\n// INFO\n//////////////////////////////////////////\n.info {\n  position: absolute;\n  left: 24px;\n\n  .title {\n    font-size: 16px;\n    line-height: 22px;\n  }\n\n  .date {\n    font-size: 11px;\n    line-height: 15px;\n    color: #9ba7c6;\n  }\n}\n\n.stack {\n  width: 100%;\n}\n\n.card {\n  width: 100%;\n  height: 100%;\n  border-radius: 8px;\n  overflow: hidden;\n  transform: rotate(0);\n  background: #fff;\n  -webkit-user-select: none;\n  -khtml-user-select: none;\n  -moz-user-select: none;\n  -o-user-select: none;\n  user-select: none;\n\n  > img {\n    width: 286px;\n    height: 458px;\n    object-fit: cover;\n    -webkit-user-select: none;\n    -khtml-user-select: none;\n    -moz-user-select: none;\n    -o-user-select: none;\n    user-select: none;\n  }\n}\n\n.try-me {\n  display: flex;\n  grid-gap: 8px;\n  align-items: center;\n  font-size: 14px;\n  margin-top: -24px;\n  font-family: \"Montserrat\", sans-serif;\n  font-weight: 600;\n  color: #fff;\n}\n</style>\n","@font-face {\n  font-family: \"Eina\";\n  src: url(\"https://assets.codepen.io/152347/eina-03-semibold.woff2\") format(\"woff2\"), url(\"https://assets.codepen.io/152347/eina-03-semibold.woff\") format(\"woff\");\n}\nbody {\n  font-family: \"Eina\", serif;\n  -webkit-font-smoothing: antialiased;\n  -moz-osx-font-smoothing: grayscale;\n  background: #9796f0;\n  /* fallback for old browsers */\n  background: -webkit-linear-gradient(to right, #fbc7d4, #9796f0);\n  /* Chrome 10-25, Safari 5.1-6 */\n  background: linear-gradient(to right, #fbc7d4, #9796f0);\n  /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */\n}\n\n#app {\n  color: #1c1c1c;\n  display: flex;\n  flex-direction: column;\n  justify-content: center;\n  align-items: center;\n  height: 100vh;\n  grid-gap: 60px;\n}\n\n.attribution {\n  text-decoration: none;\n  width: auto;\n  border-radius: 999em;\n  border: 1px solid rgba(255, 255, 255, 0.15);\n  padding: 12px 25px 12px 60px;\n  height: 30px;\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  color: #1c1c1c;\n  background: #fff;\n  background: rgba(255, 255, 255, 0.25);\n  position: relative;\n  font-family: \"Montserrat\", sans-serif;\n}\n.attribution > img {\n  color: green;\n  width: 40px;\n  height: 40px;\n  position: absolute;\n  left: 8px;\n  top: 50%;\n  transform: translate(0, -50%);\n}\n.attribution .inner {\n  display: flex;\n  flex-direction: column;\n  grid-gap: 2px;\n}\n.attribution h3 {\n  font-size: 11px;\n}\n.attribution h5 {\n  font-size: 16px;\n  font-weight: 600;\n}\n\n.container {\n  z-index: 2;\n  position: relative;\n  background: #fff;\n  border-radius: 12px;\n  width: 375px;\n  height: 667px;\n  overflow: hidden;\n  box-shadow: 0 70px 63px -60px;\n  display: flex;\n  flex-direction: column;\n}\n\n.header {\n  display: flex;\n  justify-content: space-between;\n  padding: 24px;\n}\n.header .logo {\n  align-items: baseline;\n  display: flex;\n  font-size: 29px;\n}\n.header .period {\n  width: 5px;\n  height: 5px;\n  margin-left: 4px;\n  background: #ff3366;\n}\n.header .avatar {\n  width: 32px;\n  height: 32px;\n  border-radius: 20px;\n  background: #ffe259;\n  overflow: hidden;\n}\n.header .avatar > img {\n  width: 100%;\n  height: auto;\n}\n\n.footer {\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n  padding: 24px;\n  flex-direction: row-reverse;\n  position: relative;\n}\n\n.rating {\n  display: flex;\n  justify-content: space-between;\n  justify-self: flex-end;\n}\n.rating .star {\n  background: url(\"https://assets.codepen.io/152347/star.svg\");\n  background-size: 100%;\n  width: 15px;\n  height: 15px;\n  transform: scale(0.5, 0.5);\n  margin: 2px;\n  transition: all 0.2s ease;\n  opacity: 0.5;\n}\n.rating .star.active {\n  transform: scale(1, 1);\n  opacity: 1;\n}\n\n.info {\n  position: absolute;\n  left: 24px;\n}\n.info .title {\n  font-size: 16px;\n  line-height: 22px;\n}\n.info .date {\n  font-size: 11px;\n  line-height: 15px;\n  color: #9ba7c6;\n}\n\n.stack {\n  width: 100%;\n}\n\n.card {\n  width: 100%;\n  height: 100%;\n  border-radius: 8px;\n  overflow: hidden;\n  transform: rotate(0);\n  background: #fff;\n  -webkit-user-select: none;\n  -khtml-user-select: none;\n  -moz-user-select: none;\n  -o-user-select: none;\n  user-select: none;\n}\n.card > img {\n  width: 286px;\n  height: 458px;\n  object-fit: cover;\n  -webkit-user-select: none;\n  -khtml-user-select: none;\n  -moz-user-select: none;\n  -o-user-select: none;\n  user-select: none;\n}\n\n.try-me {\n  display: flex;\n  grid-gap: 8px;\n  align-items: center;\n  font-size: 14px;\n  margin-top: -24px;\n  font-family: \"Montserrat\", sans-serif;\n  font-weight: 600;\n  color: #fff;\n}\n\n/*# sourceMappingURL=pen.vue.map */"]}, media: undefined });

  };
  /* scoped */
  const __vue_scope_id__ = undefined;
  /* module identifier */
  const __vue_module_identifier__ = undefined;
  /* functional template */
  const __vue_is_functional_template__ = false;
  /* style inject SSR */
  
  /* style inject shadow dom */
  

  
  const __vue_component__ = /*#__PURE__*/normalizeComponent(
    { render: __vue_render__, staticRenderFns: __vue_staticRenderFns__ },
    __vue_inject_styles__,
    __vue_script__,
    __vue_scope_id__,
    __vue_is_functional_template__,
    __vue_module_identifier__,
    false,
    createInjector,
    undefined,
    undefined
  );

export default __vue_component__;