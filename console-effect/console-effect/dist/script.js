var Cache = function(element) {
        this.element = element;
        this.originalString = element.innerHTML;
        this.typeText = typeText(this.element, this.originalString);
      }

      function typeText(element, string) {
        element.innerHTML = "";
        function iterateText() {
          if (element.innerHTML.length < string.length) {
            element.innerHTML += string[element.innerHTML.length];
            return setTimeout(iterateText, 1.15);
          } else {
            console.log("I'm done");
          }
        }
        iterateText();
      }

      var elements = document.querySelectorAll('p');

      for (var i = 0; i < elements.length; i++) {
        new Cache(elements[i]);
      }

      var dither = 0;
      var ditherContainer = document.getElementById('dither');

      while (dither < window.innerHeight / 3) {
        var el = document.createElement('div');
        ditherContainer.appendChild(el);
        dither++;
      }