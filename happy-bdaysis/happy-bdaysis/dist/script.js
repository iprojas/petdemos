//
// Zachstronaut LLC
// https://www.zachstronaut.com/
// June 2011
//

if (window.addEventListener) {
    window.addEventListener('load', logo, false);
}

function logo() {
    var img = new Image();
    img.src = 'data:image/gif;base64,R0lGODlhEAAQAMQAAEZFRnl4eUpLS3h5eXZ3d5SVlf//AEZGRWlpaP8AAP///3l5eWlpaVBQUEZGRiwsLCUlJR8fHx4eHhAQEAUFBQICAgAAAP///wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACH5BAEAABcALAAAAAAQABAAAAVV4CWOZGmepqKg5XqtBXslo0DE0wM0pXFZEoGlEnEwFojDxTcCWiiQxqIQ4ImYv2GRMUA4LCaLOOdoOB7gkngcgUQmadJaXKFUxKf5HKVfy/YygYIXIQA7';
    img.onload = function () {
        var c = document.createElement('canvas');
        var ctx = c.getContext('2d');
        ctx.drawImage(img, 0, 0, 16, 16);
        var imageData = ctx.getImageData(0, 0, 16, 16);

        var html = '';
        var fireX, fireY;
        var x, y, color, cssClass = '', div;
        for (var i = 0; i < imageData.data.length; i += 4) {
            if (imageData.data[i+3] > 0) {
                x = (i / 4) % imageData.width * 12;
                y = Math.floor(i / (4 * imageData.width)) * 12 - 24;
                color = '#' + RGBtoHEX(imageData.data[i], imageData.data[i+1], imageData.data[i+2]);
                
                if (color == '#ff0000') {
                    cssClass = 'fire';
                    fireX = x;
                    fireY = y;
                } else if (color == '#ffff00') {
                    cssClass = 'spark';
                    x = fireX;
                    y = fireY;
                } else {
                    cssClass = '';
                }

                div = '<div' + (cssClass == '' ? '' : ' class="' + cssClass + '"') + ' style="background: ' + color + '; left: ' + x + 'px; top: ' + y + 'px;"></div>' + "\n";
                html += div;
                if (cssClass == 'spark') {
                    html += div;
                }
            }
        }

        var b = document.getElementById('bomb')
        b.style.background = 'none';
        b.style.cursor = 'pointer';
        b.innerHTML = html;
        
        particles();
    }


    function RGBtoHEX(r, g, b) {
        return ('0' + r.toString(16)).substr(-2) + ('0' + g.toString(16)).substr(-2) + ('0' + b.toString(16)).substr(-2)
    }
}

function particles() {    
    var sparkNodes = document.getElementsByClassName('spark');
    var s = MakeSparks();
    var i = sparkNodes.length;
    while (i--) {
        s.add(sparkNodes[i]);
    }
    s.go();
    
    
    var particles = document.getElementById('bomb').getElementsByTagName('div');  
    var e = MakeExplosion();
    var i = particles.length;
    while (i--) {
        e.add(particles[i]);
    }
    document.getElementById('bomb').addEventListener(
        'click',
        function () {
            document.body.setAttribute('class', 'boom');

            document.getElementById('label').style.display = 'none';
            
            s.stop();
            e.go();
            
            setTimeout(function () {document.body.setAttribute('class', '');}, 150);
            setTimeout(function () {document.body.setAttribute('class', 'boom');}, 200);
            setTimeout(function () {document.body.setAttribute('class', '');}, 250);
        },
        false
    );
    
    
    function MakeSparks() {
        var _o = new ParticlesTemplate();

        _o.parentAdd = _o.add;
        _o.add = function (node) {
            _o.parentAdd(node, false);
        }

        _o.parentRevive = _o.revive;
        _o.revive = function (i) {
            this.nodes[i].className = 'spark sparking';
            this.nodes[i].style.opacity = '0.0';
            this.xs[i] = 0;
            this.ys[i] = 0;
            this.zs[i] = 0;
            this.xvs[i] = -2 + Math.floor(Math.random() * 4);
            this.yvs[i] = 2 + Math.floor(Math.random() * 4);
            this.zvs[i] = -5 + Math.floor(Math.random() * 10);

            _o.parentRevive(i);
        }

        _o.shouldBeKilled = function (i) {
            return this.ys[i] > 150;
        }

        _o.parentKill = _o.kill;
        _o.kill = function (i) {
            this.xs[i] = -9999;
            this.nodes[i].className = 'spark';
            this.nodes[i].style.opacity = '1.0';

            _o.parentKill(i);
        }

        _o.spawn = function () {
            if (this.ticker == 0) {
                this.revive(this.currentIndex % this.particleCount);

                this.currentIndex++;

                this.ticker = 4 + Math.floor(Math.random() * 8);
            }

            this.ticker--;
        }

        return _o;
    }


    function MakeExplosion() {
        var _o = new ParticlesTemplate();

        _o.parentAdd = _o.add;
        _o.add = function (node) {
            _o.parentAdd(node, true);
        }

        _o.parentRevive = _o.revive;
        _o.revive = function (i) {
            this.xs[i] = 0;
            this.ys[i] = 0;
            this.zs[i] = 0;
            var xFactor = (parseInt(this.nodes[i].style.left) - 192/2 + 20) / (192/4);
            var yFactor = (parseInt(this.nodes[i].style.top) - 144/2 - 15) / (144/2);

            this.xvs[i] = (10 + Math.floor(Math.random() * 10)) * (xFactor - 1);
            this.yvs[i] = (10 + Math.floor(Math.random() * 10)) * yFactor;
            this.zvs[i] = -20 + Math.floor(Math.random() * 40);

            _o.parentRevive(i);
        }

        _o.shouldBeKilled = function (i) {
            return this.ys[i] > 1000;
        }

        _o.parentKill = _o.kill;
        _o.kill = function (i) {
            this.xs[i] = -9999;

            _o.parentKill(i);
        }

        _o.parentGo = _o.go;
        _o.go = function () {
            if (_o.activeCount) {
                _o.parentGo();
            }
        }
        
        _o.spin = true;

        return _o;
    }


    function ParticlesTemplate() {
        var _self = this;

        this.particleCount = 0;
        this.activeCount = 0;

        this.nodes = [];
        this.alives = [];
        this.xs = [];
        this.ys = [];
        this.zs = [];
        this.xvs = [];
        this.yvs = [];
        this.zvs = [];

        this.xa = 0;
        this.ya = 0.6;
        this.za = 0;

        this.xf = 0.97;
        this.yf = 1;
        this.zf = 0.97;

        this.timeToStop = false;

        this.currentIndex = 0;
        this.ticker = 0;

        this.spin = false;
        
        this.transformProperty = false;
        this.vendorPrefix = false;
        this.support3D = false;

        this.add = function (node, alive) {
            if (!this.transformProperty) {
                var properties = ['transform', 'WebkitTransform', 'msTransform', 'MozTransform', 'OTransform'];
                var p;
                while (p = properties.shift())
                {
                    if (typeof node.style[p] != 'undefined')
                    {
                        this.transformProperty = p;
                        if (p != 'transform') {
                            this.vendorPrefix = p.replace('Transform', '');
                        }

                        if (typeof node.style.perspective != 'undefined' || (this.vendorPrefix && typeof node.style[this.vendorPrefix + 'Perspective'] != 'undefined')) {
                            this.support3D = true;
                        }
                        break;
                    }
                }
            }
                    
            this.nodes.push(node);

            var i = this.particleCount;
            this.particleCount++;

            if (alive) {
                this.revive(i);

            } else {
                this.kill(i);
            }
        }

        this.revive = function (i) {
            this.activeCount++;
            this.alives[i] = true;
        }

        this.shouldBeKilled = function (i) {
            return false;
        }

        this.kill = function (i) {
            this.activeCount--;
            this.alives[i] = false;
        }

        this.spawn = function () {
        }

        this.updateAll = function () {
            var i = this.particleCount;

            while (i--) {
                if (this.alives[i]) {
                    this.xvs[i] += this.xa;
                    this.yvs[i] += this.ya;
                    this.zvs[i] += this.za;

                    this.xvs[i] *= this.xf;
                    this.yvs[i] *= this.yf;
                    this.zvs[i] *= this.zf;

                    this.xs[i] += this.xvs[i];
                    this.ys[i] += this.yvs[i];
                    this.zs[i] += this.zvs[i];

                    if (this.shouldBeKilled(i)) {
                        this.kill(i);
                    }

                    var s = 1 + this.zs[i] / 200;
                    if (s < 0) {
                        s = 0;
                    }

                    if (this.support3D) {
                        this.nodes[i].style[this.transformProperty] = 'translate3d(' + this.xs[i] + 'px, ' + this.ys[i] + 'px, ' + this.zs[i] + 'px)' + (this.spin ? 'rotateX(' + Math.cos(0.1 * this.ys[i]) + 'rad) rotateY(' + Math.sin(0.1 * this.xs[i]) + 'rad)' : '');
                    } else {
                        this.nodes[i].style[this.transformProperty] = 'translate(' + this.xs[i] + 'px, ' + this.ys[i] + 'px) scale(' + s + ', ' + s + ')';
                    }
                }
            }
        }

        var _t = 0;
        this.go = function () {
            if (_self.timeToStop) {
                _self.timeToStop = false;
                return;
            }

            requestAnimationFrame(_self.go);

            var nt = Date.now()
            if (nt - _t > 32) {
                _t = nt;

                _self.spawn();

                _self.updateAll();
            }
        }

        this.stop = function () {
            _self.timeToStop = true;
        }
    }
}


/**
 * Provides requestAnimationFrame in a cross browser way.
 * @author paulirish / http://paulirish.com/
 */

if ( !window.requestAnimationFrame ) {

    window.requestAnimationFrame = ( function() {

        return window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.oRequestAnimationFrame ||
        window.msRequestAnimationFrame ||
        function( /* function FrameRequestCallback */ callback, /* DOMElement Element */ element ) {

            window.setTimeout( callback, 1000 / 60 );

        };

    } )();

}