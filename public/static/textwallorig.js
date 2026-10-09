! function() {
	var e;
	const t = document.getElementById("textarea"),
		n = document.getElementById("connecting"),
		o = document.getElementById("info"),
		a = -1 != navigator.userAgent.indexOf("Trident"),
		r = -1 != navigator.userAgent.indexOf("Firefox");
	a && (o.style.height = "50px");
	var c = devicePixelRatio,
		l = !1,
		i = document.title,
		d = !0;
	const s = document.getElementById("toast");
	var u;
	const m = document.getElementById("clipboard"),
		f = document.getElementById("usermenu"),
		h = document.getElementById("colourlist"),
		g = document.getElementById("teleport");
	var y = document.getElementById("canvas"),
		p = y.getContext("2d", {
			alpha: !1
		});
	y.width = Math.round(window.innerWidth * c), y.height = Math.round(window.innerHeight * c), y.style.width = window.innerWidth + "px", y.style.height = window.innerHeight + "px", p.imageSmoothingEnabled = !1;
	const v = "#FFFFFF",
		x = "#DCDCDC";
	var E = v,
		w = x;
	const k = document.getElementById("primary"),
		I = document.getElementById("secondary"),
		b = document.getElementById("themetext"),
		B = document.getElementById("thememenu"),
		M = 0,
		L = 1,
		S = 2;
	var C = M;
	const T = String.fromCharCode(10240),
		F = {
			"IBM Plex Mono": 16,
			Inconsolata: 18,
			"Courier Prime": 16,
			Courier: 16,
			Cousine: 16,
			monospace: 18,
			"Ubuntu Mono": 20,
			"Libertinus Mono": 16,
			Fixedsys: 18,
			Pointfree: 16,
			Monofur: 18,
			"Fantasque Sans Mono": 18
		};
	for (var D = "IBM Plex Mono", P = Math.round(F[D] * c) + "px " + D + ", monospace", O = 0; O < Object.keys(F).length; O++) option = document.createElement("option"), option.text = Object.keys(F)[O], document.getElementById("fontselect").add(option);
	document.getElementById("fontselect").value = D;
	var R = ["#222222", "#888888", "#E4E4E4", "#FFA7D1", "#E50000", "#E59500", "#A06A42", "#E5D900", "#94E044", "#02BE01", "#00D3DD", "#0083C7", "#0000EA", "#CF6EE4", "#820080"],
		j = [];
	en();
	var N, A, H, W = 0,
		K = zt(R[W], .6),
		Y = {},
		X = [],
		U = [],
		q = new Worker("/static/ping.js"),
		z = !1,
		J = {
			x: 0,
			y: 0,
			rawx: 0,
			rawy: 0,
			visible: !0,
			start: 0,
			lastedit: {
				x: 0,
				y: 0
			}
		},
		$ = {
			x: 0,
			y: 0
		},
		G = [],
		_ = [],
		Q = {},
		V = !0,
		Z = !0,
		ee = !0,
		te = !1,
		ne = [],
		oe = "",
		ae = 0,
		re = 0,
		ce = document.getElementById("coords"),
		le = document.getElementById("nearby"),
		ie = performance.now(),
		de = {
			scale: 1,
			offset: {
				x: 0,
				y: 0
			}
		},
		se = {
			start: {
				x: null,
				y: null
			},
			offset: {
				x: 0,
				y: 0
			},
			coords: {
				x: 0,
				y: 0
			}
		},
		ue = !1,
		me = !1,
		fe = !1,
		he = !1,
		ge = {},
		ye = [],
		pe = null,
		ve = [];
	for (O = 0; O < 200; O++) ve[O] = " ";
	var xe = [];
	for (O = 0; O < 200; O++) xe[O] = 0;
	document.getElementById("fontselect").onchange = function(e) {
		Te(e.target.value)
	};
	const Ee = {
		showothercurs: document.getElementById("showothercurs"),
		shownametags: document.getElementById("shownametags"),
		disablecolour: document.getElementById("disablecolour"),
		smoothpanning: document.getElementById("smoothpanning"),
		smoothcursors: document.getElementById("smoothcursors"),
		anonymous: document.getElementById("anonymous")
	};
	Ee.showothercurs.checked = !0, Ee.shownametags.checked = !0, Ee.disablecolour.checked = !1, Ee.smoothpanning.checked = !0, Ee.smoothcursors.checked = !0;
	var we = 1,
		ke = 1,
		Ie = document.getElementById("zoom");

	function be(e, t) {
		we = e < .5 ? .5 : e > 2.5 ? 2.5 : e, ke = Math.round(100 * we) / 100, localStorage.setItem("zoom", ke), Ie.value = 10 * ke, t && qt(Math.round(100 * ke) + "% ", 1e3), vt()
	}

	function Be() {
		be(Ie.value / 10, !0)
	}
	var Me = document.getElementById("registerlink"),
		Le = document.getElementById("loginlink"),
		Se = document.getElementById("logoutlink");

	function Ce(t, n) {
		t && (localStorage.removeItem("username"), localStorage.removeItem("token")), oe = "", e.readyState != e.OPEN || n || (e.send(msgpack.encode({
			logout: !0
		})), ee = !0), document.getElementById("login").style.display = "block", document.getElementById("loggedin").style.display = "none", st(!1), l = !1, document.getElementById("admin").style.display = "none", H = !0
	}

	function Te(e) {
		D = e, P = Math.round(F[e] * c) + "px " + e + ", monospace, Special", localStorage.setItem("font", e), document.getElementById("fontselect").value = e, Et()
	}

	function Fe(e, t) {
		if (Y[e].empty) return p.fillStyle = Y[e].protected ? w : E, void
		function(e) {
			p.fillRect(Math.round(10 * e[0] * c), Math.round(20 * e[1] * c), Math.ceil(Ne * c), Math.ceil(Ae * c))
		}(t);
		var n = Y[e].img;
		r && (n = Y[e].bmp), null != n ? p.drawImage(n, Math.round(10 * t[0] * c), Math.round(20 * t[1] * c), Math.ceil(Ne * c), Math.ceil(Ae * c)) : He(e)
	}

	function De(e) {
		return e = e || 0, {
			minx: -se.offset.x / c / 10 - e,
			maxx: -se.offset.x / c / 10 + window.innerWidth / ke / 10 + e - 20,
			miny: -se.offset.y / c / 20 - e,
			maxy: -se.offset.y / c / 20 + window.innerHeight / ke / 20 + e - 10
		}
	}

	function Pe(e, t) {
		return e[0] < t.minx || e[0] > t.maxx || e[1] < t.miny || e[1] > t.maxy
	}

	function Oe(e) {
		var t = 20 * Math.floor(e[0] / 20) + "," + 10 * Math.floor(e[1] / 10);
		return !(!Y[t] || !Y[t].protected)
	}

	function Re(e) {
		return Y[e].coords || e.split(",")
	}

	function je(e, t, n) {
		if ("" != e) {
			p.fillStyle = "rgba(34, 34, 34, 0.7)";
			var o = p.measureText(e);
			if (!(o.width > 150 * c || o.actualBoundingBoxAscent > 40 * c)) {
				var a = Math.round(5 * c);
				p.roundRect(Math.round(t - o.width / 2), Math.round(n + 21 * c), Math.round(o.width + 10 * c), Math.round(14 * c), {
					upperLeft: a,
					upperRight: a,
					lowerLeft: a,
					lowerRight: a
				}, !0, !1), p.fillStyle = "#FFFFFF", p.fillText(e, Math.round(t - o.width / 2 + 5 * c), Math.round(n + 31 * c))
			}
		}
	}! function() {
		p.font = "10px Special", p.fillText("abc", 0, 10), p.font = P, p.fillText("abc", 0, 10);
		for (var e = 0; e < Object.keys(F).length; e++) p.font = "10px " + Object.keys(F)[e], p.fillText("abc", 0, 10)
	}();
	const Ne = 200,
		Ae = 200;

	function He(e) {
		-1 == U.indexOf(e) && U.push(e)
	}

	function We(e) {
		-1 == U.indexOf(e) && U.unshift(e)
	}
	var Ke;
	try {
		Ke = RegExp("\\p{Extended_Pictographic}", "u")
	} catch (e) {
		Ke = !1
	}

	function Ye(e) {
		return e >= 9472 && e <= 9631 && !(e >= 9476 && e <= 9483) && !(e >= 9548 && e <= 9551)
	}

	function Xe(e) {
		return e >= 10240 && e <= 10495
	}
	var Ue = document.createElement("canvas"),
		qe = Ue.getContext("2d", {
			alpha: !1
		});

	function ze(e) {
		if (null != Y[e] && null != Y[e].txt) {
			for (var t = !0, n = 0; n < 200; n++) {
				var o = Y[e].txt[n];
				if (" " != o && o != T) {
					t = !1;
					break
				}
			}
			if (t) Y[e].empty = t;
			else {
				null == Y[e].img && (Y[e].img = document.createElement("canvas"));
				var a = Math.ceil(Ne * c),
					l = Math.ceil(Ae * c);
				Y[e].img.width = a, Y[e].img.height = l, ! function(e, t, n, o) {
					Ue.width = t, Ue.height = n, qe.imageSmoothingEnabled = !1, qe.textBaseline = "alphabetic", qe.fillStyle = Y[o].protected ? w : E, qe.fillRect(0, 0, t, n);
					for (var a = 0; a < 10; a++)
						for (var r = 0; r < 20; r++) {
							var l = 10 * r * c,
								i = 20 * a * c,
								d = Y[o].txt[r + 20 * a];
							if (" " != d && d != T) {
								var s = Ee.disablecolour.checked ? 0 : Y[o].clr[r + 20 * a],
									u = d.charCodeAt();
								if (qe.fillStyle = R[s], qe.font = P, Ke && Ke.test(d)) {
									qe.font = Math.round(14 * c) + "px Courier";
									var m = qe.measureText(d).width;
									m > Math.round(10 * c) && 19 == r && (l -= m - Math.round(10 * c)), qe.fillText(d, Math.ceil(l), Math.floor(i + 15 * c))
								} else Ye(u) || Xe(u) ? (qe.font = Math.round(20 * c) + "px Special", qe.fillText(d, Math.ceil(l), Math.round(i + 15 * c))) : qe.fillText(d, Math.ceil(l), Math.floor(i + 15 * c))
							}
						}
					e.drawImage(Ue, 0, 0)
				}(Y[e].img.getContext("2d", {
					alpha: !0
				}), a, l, e), r && createImageBitmap(Y[e].img).then((function(t) {
					null != Y[e] && (Y[e].bmp = t, H = !0)
				})), Y[e].empty = !1
			}
		}
	}
	CanvasRenderingContext2D.prototype.roundRect = function(e, t, n, o, a, r, c) {
		var l = {
			upperLeft: 0,
			upperRight: 0,
			lowerLeft: 0,
			lowerRight: 0
		};
		if (void 0 === c && (c = !0), "object" == typeof a)
			for (var i in a) l[i] = a[i];
		this.beginPath(), this.moveTo(e + l.upperLeft, t), this.lineTo(e + n - l.upperRight, t), this.quadraticCurveTo(e + n, t, e + n, t + l.upperRight), this.lineTo(e + n, t + o - l.lowerRight), this.quadraticCurveTo(e + n, t + o, e + n - l.lowerRight, t + o), this.lineTo(e + l.lowerLeft, t + o), this.quadraticCurveTo(e, t + o, e, t + o - l.lowerLeft), this.lineTo(e, t + l.upperLeft), this.quadraticCurveTo(e, t, e + l.upperLeft, t), this.closePath(), c && this.stroke(), r && this.fill()
	};
	const Je = -1e5,
		$e = 1e5,
		Ge = -1e5,
		_e = 1e5;

	function Qe(e, t) {
		return Je <= e && e < $e && Ge <= t && t < _e
	}

	function Ve() {
		for (var t, n = -80 - 20 * Math.floor(se.offset.x / c / 10 / 20), o = -40 - 10 * Math.floor(se.offset.y / c / 20 / 10), a = [], r = De(20); n < window.innerWidth / ke / 10 - se.offset.x / c / 10 + 80;) {
			for (; o < window.innerHeight / ke / 20 - se.offset.y / c / 20 + 40;) null == Y[t = n + "," + o] && Qe(n, o) && (Pe([n, o], r) ? a.push(t) : a.unshift(t)), o += 10;
			o = -40 - 10 * Math.floor(se.offset.y / c / 20 / 10), n += 20
		}
		if (a.length > 0) {
			a = a.slice(0, 99);
			for (var l = 0; l < a.length; l++) Y[a[l]] = {};
			e.send(msgpack.encode({
				r: a
			}))
		}
	}

	function Ze() {
		for (var e, t = Object.keys(Y), n = De(200), o = 0; o < t.length; o++) {
			var a = t[o],
				r = Re(a);
			!Pe(r, n) || (e = r)[0] > J.x - 20 && e[0] < J.x + 20 && e[1] > J.y - 10 && e[1] < J.y + 10 || delete Y[a]
		}
	}

	function et() {
		"ontouchstart" in window || t.focus()
	}
	var tt = !1;

	function nt() {
		var n = 20 * Math.floor(J.x / 20),
			o = 10 * Math.floor(J.y / 10),
			a = n + "," + o;
		null != Y[a] && (l && (fe && e.send(msgpack.encode({
			protect: [a]
		})), he && (tt ? tt = !1 : e.send(msgpack.encode({
			clear: [n, o, n + 19, o + 9]
		})))), t.focus())
	}

	function ot(e) {
		return e.target.parentElement.parentElement.dataset.id
	}

	function at(t) {
		e.send(msgpack.encode({
			i: ot(t)
		}))
	}

	function rt(t) {
		e.send(msgpack.encode({
			a: [ot(t), t.target.checked]
		}))
	}

	function ct(t) {
		e.send(msgpack.encode({
			aa: ot(t)
		}))
	}

	function lt(e) {
		var t = ot(e);
		null != Q[t] && (Q[t].highlighted = e.target.checked, H = !0)
	}

	function it(e) {
		var t = document.createElement("tr"),
			n = document.createElement("td"),
			o = document.createElement("td"),
			a = document.createElement("td"),
			r = document.createElement("input"),
			c = document.createElement("input"),
			l = document.createElement("button"),
			i = document.createElement("button");
		c.type = "checkbox", c.checked = !1, l.innerText = "2", i.innerText = "3", c.addEventListener("click", rt), l.addEventListener("click", ct), i.addEventListener("click", at), r.addEventListener("click", lt), r.type = "checkbox", r.checked = 1 == Q[e].highlighted, n.appendChild(r);
		var d = Q[e].c;
		o.style.backgroundColor = "#FFFFFF" == R[d] ? "#222222" : R[d], o.style.fontSize = "10px", o.innerText = Q[e].n || e, a.appendChild(c), a.appendChild(l), a.appendChild(i), t.dataset.id = e, t.appendChild(n), t.appendChild(o), t.appendChild(a), document.getElementById("admintable").appendChild(t)
	}

	function dt(e) {
		e.preventDefault()
	}

	function st(e) {
		for (var t = ["loginbtn", "registerbtn", "loginname", "loginpass", "username", "password", "password2", "registerbtn", "chngusername", "chngeusrpass", "submitnamechange", "oldpass", "newpass", "newpass2", "submitpasschange", "deletepassword", "deleteaccount"], n = 0; n < t.length; n++) document.getElementById(t[n]).disabled = e;
		if (!e) {
			var o = ["loginname", "loginpass", "username", "password", "password2", "chngusername", "chngeusrpass", "oldpass", "newpass", "newpass2", "deletepassword"];
			for (n = 0; n < o.length; n++) document.getElementById(o[n]).value = ""
		}
	}
	y.addEventListener("pointerdown", (function(e) {
		if (e.preventDefault(), null != mt && 1 != e.pointerId || Lt) return;
		mt = e.pointerId, me ? (ge.start = Ft(e), ge.end = ge.start) : (ue = !0, se.start.x = e.clientX * c, se.start.y = e.clientY * c, ye = [], pe = null, Mt(e), y.style.cursor = "move", function(e) {
			if (e.pointerId != mt) return;
			Kt();
			var t = Ft(e);
			J.x == t.x && J.y == t.y || (V = !0);
			if (J.x = t.x, J.y = t.y, J.start = J.x, e.altKey) {
				var n = Yt();
				n && Zt(n[1])
			}
			Dt()
		}(e));
		H = !0
	})), document.addEventListener("pointermove", (function(e) {
		if (e.pointerId != mt || Lt) return;
		if (e.preventDefault(), me) ge.end = Ft(e);
		else if (ue) {
			var t = e.clientX * devicePixelRatio - se.start.x / ke,
				n = e.clientY * devicePixelRatio - se.start.y / ke;
			se.offset.x = Math.round(de.offset.x + t), se.offset.y = Math.round(de.offset.y + n), Ee.smoothpanning.checked && Mt(e)
		}
		H = !0
	})), y.addEventListener("click", nt), y.addEventListener("wheel", (function(e) {
		if (ue) return;
		if (e.preventDefault(), e.ctrlKey) be(we - e.deltaY / 1e3, !0);
		else if (e.altKey) 1 == Math.sign(e.deltaY) ? Zt(W == R.length - 1 ? 0 : W + 1) : Zt(0 == W ? R.length - 1 : W - 1);
		else {
			var t = e.deltaX,
				n = e.deltaY;
			e.shiftKey && (t ^= n, t ^= n ^= t), pt(se.offset.x - t, se.offset.y - n)
		}
		H = !0
	}), {
		passive: !1
	}), document.addEventListener("pointerup", (function(t) {
		if (t.preventDefault(), t.pointerId != mt || Lt) return;
		if (me && ge.start && ge.end) {
			var n = Math.min(ge.start.x, ge.end.x),
				o = Math.min(ge.start.y, ge.end.y),
				a = Math.max(ge.start.x, ge.end.x),
				r = Math.max(ge.start.y, ge.end.y);
			if (me = !1, ge = {}, l && he) tt = !0, e.send(msgpack.encode({
				clear: [n, o, a, r]
			}));
			else {
				var c = J.x,
					i = J.y;
				J.x = n, J.y = o;
				for (var d = "", s = o; s <= r; s++) {
					for (var u = n; u <= a; u++) {
						var m = Yt();
						m && (d += m[0], J.x++)
					}
					J.x = n, J.y++, d += "\n"
				}
				Xt(d = d.slice(0, -1)), J.x = c, J.y = i, qt("Copied selection.", 1500)
			}
		} else if (mt = void 0, ue = !1, se.start.x = null, se.start.y = null, pt(se.offset.x, se.offset.y), Ee.smoothpanning.checked) {
			Mt(t);
			var f = ye.length - 1;
			((pe = {
				dx: ye[0][0] - ye[f][0],
				dy: ye[0][1] - ye[f][1],
				dt: ye[0][2] - ye[f][2]
			}).dt > 90 || Math.abs(pe.dx) < 5 && Math.abs(pe.dy) < 5) && (pe = null)
		}
		y.style.cursor = "text", H = !0
	})), document.addEventListener("pointerleave", Tt), document.addEventListener("pointercancel", Tt), t.addEventListener("input", (function(e) {
		if (e.preventDefault(), "insertLineBreak" == e.inputType) return void Jt();
		if ("deleteContentBackward" == e.inputType) return $t(), void Kt();
		if (null == e.data || "" == e.data) return;
		if ("insertFromPaste" == e.inputType) return;
		Kt(), Array.from(e.data).length > 1 ? Wt(Array.from(e.data)) : jt(e.data, 1)
	})), t.addEventListener("keydown", (function(e) {
		switch (e.keyCode) {
			case 38:
				J.y -= 1, Kt(), e.preventDefault();
				break;
			case 40:
				J.y += 1, Kt(), e.preventDefault();
				break;
			case 37:
				J.x -= 1, Kt(), e.preventDefault();
				break;
			case 39:
				J.x += 1, Kt(), e.preventDefault();
				break;
			case 9:
				J.x += 2, Kt(), e.preventDefault();
				break;
			case 36:
				J.x = J.start, Kt(), e.preventDefault();
				break;
			case 46:
				jt(" ", 0), Kt(), e.preventDefault()
		}
		a && (8 == e.keyCode ? ($t(), Kt()) : 67 == e.keyCode && e.ctrlKey ? (Ut(e), Kt()) : 13 == e.keyCode ? Jt() : e.char && 9 != e.keyCode && !e.ctrlKey && jt(e.char, 1));
		!e.ctrlKey && !e.shiftKey && !e.altKey && Dt()
	})), document.addEventListener("keydown", (function(e) {
		switch (e.keyCode) {
			case 90:
				e.ctrlKey && (! function() {
					if (0 != G.length) {
						var e = G.shift();
						J.x = e[0], J.y = e[1];
						var t = W;
						W = e[3], jt(e[2], 0, !0), W = t
					}
				}(), e.preventDefault());
				break;
			case 89:
				e.ctrlKey && (! function() {
					if (0 != _.length) {
						var e = _.shift();
						J.x = e[0], J.y = e[1];
						var t = W;
						W = e[3], jt(e[2], 1, !1), W = t
					}
				}(), e.preventDefault());
				break;
			case 67:
				e.altKey && (me = !0, y.style.cursor = "crosshair", e.preventDefault());
				break;
			case 71:
				e.ctrlKey && (e.preventDefault(), Vt());
				break;
			case 18:
				e.preventDefault();
				break;
			case 27:
				me && (me = !1, ge = {}, y.style.cursor = "text", e.preventDefault()), Kt();
				break;
			case 107:
			case 187:
				e.ctrlKey && (e.preventDefault(), be(we + .1, !0));
				break;
			case 109:
			case 189:
				e.ctrlKey && (e.preventDefault(), be(we - .1, !0))
		}
	})), t.addEventListener("paste", (function(e) {
		var t = (e.clipboardData || window.clipboardData).getData("text");
		Wt(Array.from(t))
	})), t.addEventListener("copy", Ut), le.addEventListener("click", (function() {
		qt(re + " online", 3e3)
	})), document.getElementById("closemenu").addEventListener("click", (function() {
		_t(0)
	})), document.getElementById("openmenu").addEventListener("click", (function() {
		_t(1)
	})), document.getElementById("options").addEventListener("click", (function() {
		_t(2)
	})), document.getElementById("home").addEventListener("click", (function() {
		Nt(0, 0)
	})), document.getElementById("copy").addEventListener("click", Ut), document.getElementById("link").addEventListener("click", (function() {
		history.pushState({}, null, "/"), Xt(location.protocol + "//" + location.hostname + location.pathname.replace(gn(), "") + "?x=" + J.x + "&y=" + -J.y), qt("Copied link.", 1e3);
		var e = document.getElementById("linkico");
		e.src = "static/done.svg", setTimeout((function() {
			e.src = "static/link.svg"
		}), 1e3), t.focus()
	})), document.getElementById("theme").addEventListener("click", (function() {
		tn()
	})), k.addEventListener("input", nn), I.addEventListener("input", nn), b.addEventListener("change", (function(e) {
		nn(e), tn(S)
	})), document.getElementById("goto").addEventListener("click", Vt), f.addEventListener("click", (function(e) {
		var t = JSON.stringify(e.target.checked);
		switch (e.target) {
			case Ee.showothercurs:
				localStorage.setItem("showothercurs", t), H = !0;
				break;
			case Ee.shownametags:
				localStorage.setItem("shownametags", t), H = !0;
				break;
			case Ee.disablecolour:
				localStorage.setItem("disablecolour", t), H = !0, Et();
				break;
			case Ee.smoothpanning:
				localStorage.setItem("smoothpanning", t), H = !0;
				break;
			case Ee.smoothcursors:
				localStorage.setItem("smoothcursors", t);
				break;
			case Ee.anonymous:
				localStorage.setItem("anonymous", t), ee = !0, H = !0;
				break;
			case Me:
				document.getElementById("login").style.display = "none", document.getElementById("register").style.display = "block";
				break;
			case Le:
				document.getElementById("login").style.display = "block", document.getElementById("register").style.display = "none";
				break;
			case Se:
				Ce(!0)
		}
	})), document.getElementById("closeteleport").addEventListener("click", (function() {
		g.classList.remove("open")
	})), document.getElementById("tpwordgo").addEventListener("click", (function(e) {
		e.preventDefault();
		var t = document.getElementById("tpword").value;
		if ("" == (t = t.replace(/^\/|\/$/g, ""))) Nt(0, 0), t = "/";
		else {
			var n = yn(t);
			Nt(n.x, n.y)
		}
		history.pushState({}, null, t), g.classList.remove("open")
	})), document.getElementById("tpword").addEventListener("input", (function() {
		var e = document.getElementById("tpword").value.replace(/^\/|\/$/g, ""),
			t = 0 == e ? {
				x: 0,
				y: 0
			} : yn(e);
		document.getElementById("tpx").value = t.x, document.getElementById("tpy").value = -t.y
	})), document.getElementById("tpcoordgo").addEventListener("click", (function(e) {
		e.preventDefault();
		var t = parseInt(document.getElementById("tpx").value, 10),
			n = parseInt(document.getElementById("tpy").value, 10);
		if (isNaN(t) && isNaN(n)) return;
		0 !== t && (t = t || J.x);
		0 !== n && (n = n || J.y);
		t = Math.max(Math.min(t, 99999), Je), n = Math.max(Math.min(-n, 99999), Ge), Nt(t, n), history.pushState({}, null, "/"), g.classList.remove("open")
	})), window.addEventListener("resize", vt), window.addEventListener("orientationchange", vt), window.addEventListener("popstate", (function() {
		var e = yn(gn());
		Nt(e.x, e.y)
	})), window.addEventListener("focus", (function() {
		d = !0, document.title = i, vn()
	})), window.addEventListener("blur", (function() {
		d = !1, xt()
	})), Ie.addEventListener("input", Be), Ie.addEventListener("change", Be), q.addEventListener("message", (function(t) {
		e && e.readyState == e.OPEN && e.send(msgpack.encode(t.data))
	})), document.getElementById("chatbutton").addEventListener("click", (function(e) {
		ft.classList.contains("open") ? ft.classList.remove("open") : (ft.classList.add("open"), ht.classList.remove("show"), gt())
	})), document.getElementById("sendmsg").addEventListener("click", yt), document.getElementById("chatmsg").addEventListener("keyup", (function(e) {
		13 == e.keyCode && yt()
	})), document.getElementById("loginbtn").addEventListener("click", (function() {
		var t = document.getElementById("loginname"),
			n = document.getElementById("loginpass");
		if (!ut.test(t.value)) return void qt("Username is invalid.", 3e3);
		if (0 == t.value.length) return void qt("Please type your username.", 3e3);
		if (0 == n.value.length) return void qt("Please type your password.", 3e3);
		st(!0), e.send(msgpack.encode({
			login: [t.value, n.value]
		}))
	})), document.getElementById("registerbtn").addEventListener("click", (function() {
		var t = document.getElementById("username"),
			n = document.getElementById("password"),
			o = document.getElementById("password2");
		if (!ut.test(t.value)) return void qt("Username is invalid.", 3e3);
		if (0 == t.value.length) return void qt("Please type a username.", 3e3);
		if (0 == n.value.length) return void qt("Please type a password.", 3e3);
		if (n.value != o.value) return void qt("Passwords do not match.", 3e3);
		st(!0), e.send(msgpack.encode({
			register: [t.value, n.value]
		}))
	})), document.getElementById("login").addEventListener("submit", dt), document.getElementById("register").addEventListener("submit", dt), document.getElementById("accsettinglink").addEventListener("click", (function() {
		var e = document.getElementById("accountsettings");
		e.style.display = "block" == e.style.display ? "none" : "block"
	})), document.getElementById("submitnamechange").addEventListener("click", (function() {
		var t = document.getElementById("chngusername"),
			n = document.getElementById("chngeusrpass");
		if (!ut.test(t.value)) return void qt("Username is invalid.", 3e3);
		if (0 == t.value.length) return void qt("Please type a new username.", 3e3);
		if (oe == t.value) return void qt("You have typed in your current username.", 3e3);
		if (0 == n.value.length) return void qt("Please type your password.", 3e3);
		st(!0), e.send(msgpack.encode({
			namechange: [t.value, n.value]
		}))
	})), document.getElementById("submitpasschange").addEventListener("click", (function() {
		var t = document.getElementById("oldpass"),
			n = document.getElementById("newpass"),
			o = document.getElementById("newpass2");
		if (0 == t.value.length) return void qt("Please type your password.", 3e3);
		if (0 == n.value.length) return void qt("Please type your new password.", 3e3);
		if (0 == o.value.length) return void qt("Please type your new password again.", 3e3);
		if (n.value != o.value) return void qt("New passwords do not match.", 3e3);
		if (t.value == n.value) return void qt("New password is the same as the old one.", 3e3);
		st(!0), e.send(msgpack.encode({
			passchange: [t.value, n.value]
		}))
	})), document.getElementById("deleteaccount").addEventListener("click", (function() {
		var t = document.getElementById("deletepassword");
		if (0 == t.value.length) return void qt("Please type your password.", 3e3);
		st(!0), e.send(msgpack.encode({
			deleteaccount: t.value
		}))
	})), document.getElementById("protect").addEventListener("click", (function(e) {
		l && (fe = e.target.checked)
	})), document.getElementById("clear").addEventListener("click", (function(e) {
		l && (he = e.target.checked)
	})), document.getElementById("g").addEventListener("click", (function() {
		e.send(msgpack.encode({
			g: 0
		}))
	})), document.getElementById("refresh").addEventListener("click", (function() {
		if (l) {
			document.getElementById("admintable").innerHTML = "";
			for (var e = !1, t = Object.keys(Q), n = 0; n < t.length; n++) {
				it(t[n]), e = !0
			}
			if (e) {
				var o = document.getElementById("optionsmenu");
				o.scrollTop = o.scrollHeight
			}
		}
	})), document.getElementById("sendalert").addEventListener("click", (function() {
		var t = document.getElementById("alerttext").value;
		if (!l || 0 == t.length) return;
		e.send(msgpack.encode({
			alert: t
		}))
	})), document.getElementById("reload").addEventListener("click", (function() {
		l && e.send(msgpack.encode({
			reload: !0
		}))
	})), document.getElementById("delete").addEventListener("click", (function() {
		if (l) {
			var t = document.getElementById("deletename").value;
			0 != t.length && e.send(msgpack.encode({
				aaa: t
			}))
		}
	})), document.getElementById("reset").addEventListener("click", (function() {
		l && e.send(msgpack.encode({
			ci: !0
		}))
	}));
	var ut = /^[\w.-]+$/;
	var mt, ft = document.getElementById("chat"),
		ht = document.getElementById("unread");

	function gt() {
		var e = document.getElementById("chatbox");
		e.scrollTop = e.scrollHeight
	}

	function yt() {
		var t = document.getElementById("chatmsg");
		gt(), "" == t.value || ie + 300 > performance.now() || (e.send(msgpack.encode({
			msg: t.value.substr(0, 160)
		})), ie = performance.now(), t.value = "", t.focus())
	}

	function pt(e, t, n) {
		n ? (se.offset.x = e, se.offset.y = t) : (se.offset.x = Math.ceil(e), se.offset.y = Math.ceil(t)), de.offset.x = se.offset.x, de.offset.y = se.offset.y;
		var o = se.coords.x,
			a = se.coords.y;
		se.coords.x = Math.floor(window.innerWidth / ke / 20 - se.offset.x / 10 / c), se.coords.y = Math.floor(window.innerHeight / ke / 40 - se.offset.y / 20 / c), te = (o != se.coords.x || a != se.coords.y) && Qe(se.coords.x, se.coords.y)
	}

	function vt() {
		var e = c;
		if (c = devicePixelRatio * ke, y.width = Math.round(window.innerWidth * devicePixelRatio), y.height = Math.round(window.innerHeight * devicePixelRatio), y.style.width = window.innerWidth + "px", y.style.height = window.innerHeight + "px", p.imageSmoothingEnabled = !1, H = !0, e != c) {
			var t = Math.floor((se.offset.x - y.width / 2) / e),
				n = Math.floor((se.offset.y - y.height / 2) / e);
			pt((t + window.innerWidth / ke / 2) * c, (n + window.innerHeight / ke / 2) * c), Te(D)
		}
	}

	function xt() {
		document.title = i + " (" + ae + " nearby)"
	}

	function Et(e) {
		U = [];
		for (var t = Object.keys(Y), n = De(20), o = 0; o < t.length; o++) {
			var a = t[o];
			if (e) Y[a].protected && He(a);
			else if (!Y[a].empty) Pe(Re(a), n) ? He(a) : We(a)
		}
	}

	function wt() {
		document.getElementById("connecting1").innerText = "Connected.", document.getElementById("connecting2").innerText = "", document.getElementById("admin").style.display = "none", N = setInterval(Ve, 250), A = setInterval(Ze, 6e3), Kt(), n.style.opacity = "0%", me = !1, ge = {}, y.style.cursor = "text", Y = {}, Q = {}, X = [], Bt(), document.getElementById("chat").style.display = "flex", V = !0, Z = !0, ee = !0, setTimeout((function() {
			n.style.display = "none"
		}), 500), null != localStorage.getItem("username") && null != localStorage.getItem("token") && (st(!0), e.send(msgpack.encode({
			token: [localStorage.getItem("username"), localStorage.getItem("token")]
		})))
	}

	function kt() {
		d || (document.title = i + " (disconnected)"), l = !1, document.getElementById("chatbox").appendChild(document.createElement("hr")), gt(), n.style.display = "flex", setTimeout((function() {
			n.style.opacity = "100%"
		}), 50), clearInterval(N), clearInterval(A), Kt(), Ce(!1), document.getElementById("connecting1").innerText = "Connection lost.", document.getElementById("connecting2").innerText = "Click here to reconnect.", n.onclick = vn
	}

	function It(e) {
		for (var t = [], n = 0; n < e.length; n++)
			if (Array.isArray(e[n]))
				for (var o = 0; o < e[n][1]; o++) t.push(e[n][0]);
			else t.push(e[n]);
		return t
	}

	function bt(e) {
		var t = new Uint8Array(e.data).buffer,
			n = msgpack.decode(new Uint8Array(t));
		switch (Object.keys(n)[0]) {
			case "alert":
				qt(n.alert, 8e3);
				break;
			case "online":
				re = n.online, le.title = re + " online";
				break;
			case "e":
				for (var o = n.e, a = 0; a < o.length; a++) {
					var r = o[a][2],
						c = o[a][3],
						i = r + "," + c;
					if (null != Y[i] && null != Y[i].txt) {
						var d = o[a][4];
						Y[i].txt[d] == o[a][0] && Y[i].clr[d] == o[a][1] || (Y[i].txt[d] = o[a][0], Y[i].clr[d] = o[a][1], We(i)), Pt(r + (d - 20 * Math.floor(d / 20)), c + Math.floor(d / 20), o[a][1])
					}
				}
				break;
			case "chunks":
				n = n.chunks;
				var s = Object.keys(n).sort();
				for (a = 0; a < s.length; a++) {
					var u = s[a];
					Y[u].coords = u.split(","), n[u][2] && (Y[u].protected = !0), 0 != n[u][0] ? (He(u), Y[u].txt = It(n[u][0]), Y[u].clr = It(n[u][1])) : (Y[u].txt = ve.slice(), Y[u].clr = xe.slice(), Y[u].empty = !0)
				}
				H = !0;
				break;
			case "p":
				var m = n.p,
					f = Object.keys(m);
				for (a = 0; a < f.length; a++) null != Y[f[a]] && (Y[f[a]].protected = m[f[a]], We(f[a]));
				break;
			case "c":
				var h = n.c;
				! function(e, t, n, o) {
					for (var a = t; a <= o; a++)
						for (var r = e; r <= n; r++) {
							var c = 20 * Math.floor(r / 20),
								l = 10 * Math.floor(a / 10),
								i = c + "," + l;
							if (null != Y[i] && null != Y[i].txt) {
								var d = r - c + 20 * (a - l);
								Y[i].txt[d] = " ", Y[i].clr[d] = 0, He(i)
							}
						}
					H = !0
				}(h[0], h[1], h[2], h[3]);
				break;
			case "cu":
				var g = n.cu,
					y = g.id;
				null == Q[y] && (Q[y] = {
					c: 0,
					n: "",
					l: [0, 0]
				}), Object.keys(g).includes("l") && (Q[y].l = g.l, Ee.smoothcursors.checked || (Q[y].rawx = Q[y].l[0], Q[y].rawy = Q[y].l[1])), Object.keys(g).includes("c") && (Q[y].c = g.c), Object.keys(g).includes("n") && (Q[y].n = g.n), H = !0, Bt();
				break;
			case "msg":
				var p = n.msg;
				! function(e, t, n) {
					var o = document.getElementById("chatbox"),
						a = document.createElement("p"),
						r = document.createElement("u");
					r.innerText = e, r.style.color = "#FFFFFF" == R[t] ? "#222222" : R[t], a.appendChild(r), a.appendChild(document.createTextNode(" ~ " + n));
					var c = Math.abs(o.scrollHeight - o.scrollTop - o.clientHeight) < 5;
					o.appendChild(a), c && gt(), ft.classList.contains("open") || ht.classList.add("show")
				}(p[0], p[1], p[2]);
				break;
			case "rc":
				delete Q[n.rc], H = !0, Bt();
				break;
			case "nametaken":
				qt("Username is already in use.", 3e3), st(!1);
				break;
			case "wrongpass":
				qt("Password is incorrect.", 3e3), st(!1);
				break;
			case "loginfail":
				qt("Username/Password is incorrect.", 3e3), st(!1);
				break;
			case "tokenfail":
				st(!1), localStorage.removeItem("username"), localStorage.removeItem("token");
				break;
			case "namechanged":
				st(!1), qt("Your username is now: " + (oe = n.namechanged), 3e3), localStorage.setItem("username", oe), document.getElementById("name").innerText = oe, H = !0, ee = !0;
				break;
			case "passchanged":
				qt("Password has been changed.", 3e3), st(!1);
				break;
			case "accountdeleted":
				qt("Your account has been deleted.", 3e3), st(!1), ee = !0, Ce(!0, !0);
				break;
			case "cool":
				qt("You're doing that too fast.", 3e3), st(!1);
				break;
			case "token":
				st(!1);
				var v = n.token;
				oe = v[0], localStorage.setItem("username", oe), localStorage.setItem("token", v[1]), document.getElementById("login").style.display = "none", document.getElementById("register").style.display = "none", document.getElementById("loggedin").style.display = "block", document.getElementById("name").innerText = oe, H = !0, ee = !0;
				break;
			case "admin":
				n.admin ? (l = !0, document.getElementById("admin").style.display = "block") : (l = !1, document.getElementById("admin").style.display = "none");
				break;
			case "t":
				document.getElementById("t").value = n.t
		}
	}

	function Bt() {
		ae = Object.keys(Q).length, le.innerText = ae + " nearby";
		var e = document.getElementById("chatmsg");
		e.placeholder = 0 == ae ? "chat to nobody" : 1 == ae ? "chat to 1 other user" : "chat to " + ae + " other users", d || xt()
	}

	function Mt(e) {
		ye.unshift([e.clientX * c / ke, e.clientY * c / ke, performance.now()]), ye.length > 4 && ye.pop()
	}
	var Lt = !1,
		St = 0;

	function Ct(e) {
		return e * e
	}

	function Tt(e) {
		e.preventDefault(), e.pointerId == mt && (mt = void 0)
	}

	function Ft(e) {
		return {
			x: Math.floor((e.pageX * devicePixelRatio - se.offset.x) / (10 * c)),
			y: Math.floor((e.pageY * devicePixelRatio - se.offset.y) / (20 * c))
		}
	}

	function Dt() {
		ce.innerText = J.x + "," + -J.y, J.x + se.offset.x / c / 10 <= 0 && pt(10 * -J.x * c, se.offset.y), J.x + se.offset.x / c / 10 >= window.innerWidth / ke / 10 - 1 && pt((10 * -J.x + window.innerWidth / ke - 10) * c, se.offset.y), J.y + se.offset.y / c / 20 <= 0 && pt(se.offset.x, 20 * -J.y * c);
		var e = window.innerWidth < 750 ? o.clientHeight : 0;
		J.y + se.offset.y / c / 20 >= (window.innerHeight - e) / ke / 20 - 1 && pt(se.offset.x, (20 * -J.y + window.innerHeight / ke - 20 - e / ke) * c), V = $.x != J.x || $.y != J.y || V, $.x = J.x, $.y = J.y, Ee.smoothcursors.checked || (J.rawx = J.x, J.rawy = J.y), (Math.abs(J.lastedit.x - J.x) > 300 || Math.abs(J.lastedit.y - J.y) > 300) && (J.start = J.x, G = [], _ = []), J.x < J.start && (J.start = J.x), H = !0, localStorage.setItem("x", J.x), localStorage.setItem("y", J.y)
	}

	function Pt(e, t, n) {
		Ee.disablecolour.checked && (n = 0), Pe([e, t], De(20)) || ne.push([e, t, .1, n])
	}
	y.addEventListener("touchstart", (function(e) {
		2 === e.touches.length && (Lt = !0, mt = void 0, St = 0, t.blur())
	}), {
		passive: !0
	}), y.addEventListener("touchmove", (function(e) {
		Lt && (! function(e) {
			if (e.touches.length > 1) {
				var t = Math.sqrt(Ct(e.touches[0].pageX - e.touches[1].pageX) + Ct(e.touches[0].pageY - e.touches[1].pageY));
				0 != St && be(we - (St - t) / 300, !0), mt = void 0, St = t
			}
		}(e), t.blur())
	}), {
		passive: !0
	}), y.addEventListener("touchend", (function(e) {
		Lt && (mt = void 0, St = 0, Lt = !1, t.blur())
	}));
	var Ot = 0,
		Rt = performance.now();

	function jt(e, t, n) {
		if (performance.now() - Rt >= 100 && (Rt = performance.now(), Ot = 0), !e || Ot > 4) return !1;
		if (Ot++, Xe((e = Array.from(e)[0]).charCodeAt())) return !1;
		var o = 20 * Math.floor(J.x / 20),
			a = 10 * Math.floor(J.y / 10),
			r = o + "," + a;
		if (null == Y[r]) return !1;
		if (Y[r].protected && !l || null == Y[r].txt) return !1;
		var c = J.x - o + 20 * (J.y - a);
		return (Y[r].txt[c] != e || Y[r].clr[c] != W && " " != e) && (n ? function(e, t, n, o) {
			_.unshift([e, t, n, o]), _.length > 1e3 && _.pop()
		}(J.x, J.y, Y[r].txt[c], Y[r].clr[c]) : function(e, t, n, o) {
			G.unshift([e, t, n, o]), G.length > 1e3 && G.pop()
		}(J.x, J.y, Y[r].txt[c], Y[r].clr[c]), Y[r].txt[c] = e, Y[r].clr[c] = W, X.push([e, W, o, a, c])), We(r), J.lastedit.x = J.x, J.lastedit.y = J.y, J.x += t, Dt(), !0
	}

	function Nt(e, t) {
		0 == e && 0 == t && 0 != J.x && 0 != J.y && history.pushState({}, null, "/"), J.x = e, J.y = t, pt((10 * -J.x + window.innerWidth / ke / 2) * c, (20 * -J.y + window.innerHeight / ke / 2) * c), document.getElementById("tpword").value = "", document.getElementById("tpx").value = 0, document.getElementById("tpy").value = 0, Kt(), Dt(), et(), Ze()
	}
	const At = Math.log(5 / 3) / 1e3;
	var Ht = !1;

	function Wt(e) {
		z || (1 != e.length ? (z = !0, Ht || (Ht = !0, J.start = J.x, function t(n) {
			return n != e.length && z ? "\r" == e[n] ? t(n + 1) : "\n" == e[n] ? (J.x = J.start, J.y++, Dt(), t(n + 1)) : (jt(e[n], 1), setTimeout(t, 36 * Math.pow(Math.E, At * n), n + 1)) : (Kt(), void(Ht = !1))
		}(0))) : jt(e[0], 1))
	}

	function Kt() {
		z = !1
	}

	function Yt() {
		var e = 20 * Math.floor(J.x / 20),
			t = 10 * Math.floor(J.y / 10),
			n = Y[e + "," + t];
		if (!n) return !1;
		var o = J.x - e + 20 * (J.y - t);
		return [n.txt[o], n.clr[o]]
	}

	function Xt(e) {
		navigator.clipboard ? navigator.clipboard.writeText(e) : (m.value = e, m.focus(), m.select(), document.execCommand("copy"))
	}

	function Ut(e) {
		var n = Yt();
		if (n) {
			Xt(n[0]), e.preventDefault(), e.clipboardData || qt("Copied character.", 1e3);
			var o = document.getElementById("copyico");
			o.src = "static/done.svg", setTimeout((function() {
				o.src = "static/copy.svg"
			}), 1e3), t.focus()
		}
	}

	function qt(e, t) {
		clearTimeout(u), s.innerText = e, s.classList.add("toasting"), u = setTimeout((function() {
			s.classList.remove("toasting")
		}), t)
	}

	function zt(e, t) {
		e = e.replace("#", "");
		var n = parseInt(3 == e.length ? e.slice(0, 1).repeat(2) : e.slice(0, 2), 16),
			o = parseInt(3 == e.length ? e.slice(1, 2).repeat(2) : e.slice(2, 4), 16),
			a = parseInt(3 == e.length ? e.slice(2, 3).repeat(2) : e.slice(4, 6), 16);
		return t ? "rgba(" + n + ", " + o + ", " + a + ", " + t + ")" : "rgb(" + n + ", " + o + ", " + a + ")"
	}

	function Jt() {
		J.x = J.start, J.y = J.y + 1, Dt()
	}

	function $t() {
		J.x -= 1, jt(" ", 0) || (J.x += 1)
	}
	var Gt = 0;

	function _t(e) {
		switch ((2 == e && 2 == Gt || 1 == e && 1 == Gt) && (e = 0), e) {
			case 0:
				f.style.transform = "translateX(-105%)";
				break;
			case 1:
				var t = document.getElementById("optionsmenu").clientWidth;
				f.style.transform = "translateX(" + -t + "px)";
				break;
			default:
				f.style.transform = "translateX(0px)", g.classList.contains("open") && g.classList.remove("open")
		}
		Gt = e, et()
	}

	function Qt(e) {
		var t = document.createElement("div");
		t.classList.add("colour"), t.addEventListener("click", (function() {
			Zt(e), nt()
		})), t.setAttribute("id", e), t.style.backgroundColor = R[e], h.appendChild(t)
	}

	function Vt() {
		g.classList.contains("open") ? (g.classList.remove("open"), et()) : (g.classList.add("open"), 2 == Gt && _t(0), document.getElementById("tpword").focus())
	}

	function Zt(e) {
		W != e && (Z = !0), document.getElementById(W).classList.remove("selected"), K = zt(R[W = e], .6), document.getElementById(W).classList.add("selected"), document.getElementById("theme-colour").setAttribute("content", R[e]), localStorage.setItem("col", e), H = !0
	}
	for (O = 0; O < R.length; O++) Qt(O);

	function en() {
		for (O = 0; O < R.length; O++) j[O] = zt(R[O], .2)
	}

	function tn(e) {
		if (null != e) C = e;
		else switch (C) {
			case M:
				C = L;
				break;
			case L:
				C = S;
				break;
			case S:
				C = M
		}
		C == M && (R[0] = "#222222", document.getElementById("themeico").src = "static/sun.svg", E = v, w = x), C == L && (R[0] = "#FFFFFF", document.getElementById("themeico").src = "static/moon.svg", E = "#000000", w = "#222222"), C == S ? (R[0] = b.checked ? "#FFFFFF" : "#222222", document.getElementById("themeico").src = "static/star.svg", E = k.value, w = I.value, B.classList.remove("hidden")) : B.classList.add("hidden"), localStorage.setItem("theme", C), H = !0, et(), Zt(W), en(), Et()
	}

	function nn(e) {
		e.target == k ? (E = k.value, Et()) : e.target == I && (w = I.value, Et(!0)), localStorage.setItem("customtheme", JSON.stringify({
			primary: k.value,
			secondary: I.value,
			texttheme: b.checked
		}))
	}

	function on(e, t, n) {
		if (Math.abs(e - t) > .1) {
			for (var o = 0; o < n; o++) e += (t - e) / 20;
			return H = !0, Math.round(100 * e) / 100
		}
		return e != t ? (H = !0, Math.round(e)) : e
	}
	setInterval((function() {
		if (e && e.readyState == e.OPEN) {
			if (X.length > 0) {
				var t;
				t = X.splice(0, 16), e.send(msgpack.encode({
					e: t
				}))
			}
			if ((V || Z || ee || te) && Qe(J.x, J.y)) {
				var n = {};
				V && (n.l = [J.x, J.y]), Z && (n.c = W), ee && (n.n = Ee.anonymous.checked), te && (n.p = [se.coords.x, se.coords.y]), e.send(msgpack.encode({
					ce: n
				})), V = !1, Z = !1, ee = !1, te = !1
			}
		}
	}), 200);
	var an = performance.now(),
		rn = 100,
		cn = performance.now() + 1e3;
	window.requestAnimationFrame((function e() {
		var n = Math.min(Math.ceil(performance.now() - an), 100);
		if (an = performance.now(), (n < rn || an > cn) && (rn = n, cn = performance.now() + 1e3), null != pe) {
			H = !0, pt(se.offset.x + pe.dx, se.offset.y + pe.dy, !0), 0 == pe.dx && 0 == pe.dy && pt(se.offset.x, se.offset.y);
			for (var o = 0; o < n; o++) pe.dx *= .993, pe.dy *= .993;
			Math.abs(pe.dx) <= .3 && (pe.dx = 0), Math.abs(pe.dy) <= .3 && (pe.dy = 0), 0 == pe.dy && 0 == pe.dx && (pe = null)
		}
		if (Ee.smoothcursors.checked) {
			J.rawx = on(J.rawx, J.x, n), J.rawy = on(J.rawy, J.y, n);
			for (var a = De(20), r = Object.keys(Q), l = 0; l < r.length; l++) {
				var i = r[l];
				null == Q[i].rawx || null == Q[i].rawy || Pe(Q[i].l, a) || (Q[i].rawx = on(Q[i].rawx, Q[i].l[0], n), Q[i].rawy = on(Q[i].rawy, Q[i].l[1], n))
			}
		}
		if (0 != ne.length) {
			for (l = 0; l < ne.length; l++)
				if (ne[l][2] < .01) ne.splice(l, 1);
				else
					for (o = 0; o < n; o++) ne[l][2] *= .995;
			H = !0
		}
		if (H && (! function() {
				p.setTransform(1, 0, 0, 1, 0, 0), p.fillStyle = w, p.fillRect(0, 0, y.width, y.height), p.translate(Math.ceil(se.offset.x), Math.ceil(se.offset.y));
				const e = 10 * c,
					t = 20 * c;
				for (var n = De(20), o = De(200), a = Object.keys(Y), r = a.length, l = 0; l < r; l++) Pe(d = Re(s = a[l]), n) ? Pe(d, o) && delete Y[s].img : Fe(s, d);
				if (Ee.showothercurs.checked) {
					p.font = Math.round(11 * c) + "px " + D;
					var i = Object.keys(Q);
					for (l = 0; l < i.length; l++) {
						var d, s = i[l];
						if (!(Pe(d = Q[s].l, n) || Oe(d) && !Q[s].highlighted)) {
							null != Q[s].rawx && null != Q[s].rawy || (Q[s].rawx = d[0], Q[s].rawy = d[1]);
							var u = Math.round(10 * Q[s].rawx * c),
								m = Math.round(20 * Q[s].rawy * c);
							Q[s].highlighted && (p.fillStyle = "rgba(239, 255, 71, 0.5)", p.fillRect(u - 2 * c, m - 2 * c, Math.ceil(e) + 4 * c, Math.round(t) + 4 * c)), p.fillStyle = j[Q[s].c], p.fillRect(u, m, Math.ceil(e), Math.round(t)), Ee.shownametags.checked && je(Q[s].n, u, m)
						}
					}
				}
				for (l = 0; l < ne.length; l++) p.fillStyle = j[ne[l][3]].replace("0.2", ne[l][2]), p.fillRect(10 * ne[l][0] * c, 20 * ne[l][1] * c, e, t);
				if (p.fillStyle = K, u = Math.round(10 * J.rawx * c), m = Math.round(20 * J.rawy * c), p.fillRect(u, m, Math.ceil(e), Math.round(t)), Ee.shownametags.checked && !Ee.anonymous.checked && je(oe, u, m), me && ge.start && ge.end) {
					p.fillStyle = "rgba(0,120,212,0.5)", u = Math.round(10 * Math.min(ge.start.x, ge.end.x) * c), m = Math.round(20 * Math.min(ge.start.y, ge.end.y) * c);
					var f = Math.round(10 * Math.max(ge.start.x, ge.end.x) * c - u + 10 * c),
						h = Math.round(20 * Math.max(ge.start.y, ge.end.y) * c - m + 20 * c);
					p.fillRect(u, m, f, h)
				}
			}(), H = !1, "\n" != t.value && (t.value = "\n", t.selectionEnd = 1)), 0 != U.length) {
			var d = an + (rn - 2);
			for (ze(U.shift()); 0 != U.length && performance.now() < d;) ze(U.shift());
			H = !0
		}
		window.requestAnimationFrame(e)
	})), null != localStorage.getItem("x") && (J.x = parseInt(localStorage.getItem("x"))), null != localStorage.getItem("y") && (J.y = parseInt(localStorage.getItem("y"))), null != localStorage.getItem("col") ? Zt(parseInt(localStorage.getItem("col"))) : Zt(0), null != localStorage.getItem("font") && null != F[localStorage.getItem("font")] && Te(localStorage.getItem("font"));
	var ln = Object.keys(Ee);
	for (O = 0; O < ln.length; O++) {
		var dn = ln[O];
		null != localStorage.getItem(dn) && (Ee[dn].checked = "true" == localStorage.getItem(dn))
	}
	if (null != localStorage.getItem("customtheme")) {
		var sn = localStorage.getItem("customtheme");
		try {
			var un = JSON.parse(sn);
			null != un.primary && (k.value = un.primary), null != un.secondary && (I.value = un.secondary), null != un.texttheme && (b.checked = un.texttheme)
		} catch (e) {}
	}
	if (null != localStorage.getItem("theme")) {
		var mn = localStorage.getItem("theme");
		tn(mn == M || mn == L || mn == S ? Number(mn) : C)
	}
	var fn, hn = (fn = {}, window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, (function(e, t, n) {
		fn[t] = n
	})), fn);

	function gn() {
		return location.pathname.split("/").pop()
	}

	function yn(e) {
		if ("" == (e = decodeURI(e.toLowerCase()))) return {
			x: 0,
			y: 0
		};
		var t = function(e) {
			var t, n = [],
				o = e + "",
				a = 0;
			for (; a < o.length;) n[255 & a] = 255 & (t ^= 19 * n[255 & a]) + o.charCodeAt(a++);
			var r, c = n.length,
				l = this,
				i = 0,
				d = (a = l.i = l.j = 0, l.S = []);
			c || (n = [c++]);
			for (; i < 256;) d[i] = i++;
			for (i = 0; i < 256; i++) d[i] = d[a = 255 & a + n[i % c] + (r = d[i])], d[a] = r;
			var s = function(e) {
				for (var t, n = 0, o = l.i, a = l.j, r = l.S; e--;) t = r[o = 255 & o + 1], n = 256 * n + r[255 & (r[o] = r[a = 255 & a + t]) + (r[a] = t)];
				return l.i = o, l.j = a, n
			};
			return s(256),
				function() {
					for (var e = s(6), t = 281474976710656, n = 0; e < 4503599627370496;) e = 256 * (e + n), t *= 256, n = s(1);
					for (; e >= 9007199254740992;) e /= 2, t /= 2, n >>>= 1;
					return (e + n) / t
				}
		}(e);
		return {
			x: 20 * Math.floor((Math.floor(2e5 * t()) - 1e5) / 20),
			y: 10 * Math.floor((Math.floor(2e5 * t()) - 1e5) / 10)
		}
	}
	if (null != hn.x && (J.x = parseInt(hn.x)), null != hn.y && (J.y = -1 * parseInt(hn.y)), gn().length > 0) {
		var pn = yn(gn());
		J.x = pn.x, J.y = pn.y
	}

	function vn() {
		if (null == e || e.readyState != WebSocket.CONNECTING && e.readyState != WebSocket.OPEN) {
			var t = "wss://" + location.host + "/ws";
			"https:" !== location.protocol && (t = "ws://" + location.host + "/ws"), (e = new WebSocket(t)).binaryType = "arraybuffer", e.onmessage = bt, e.onclose = kt, e.onerror = kt, e.onopen = wt, document.getElementById("connecting1").innerText = "Connecting...", document.getElementById("connecting2").innerText = "", n.onclick = void 0
		}
	}
	isNaN(J.x) && (J.x = 0), isNaN(J.y) && (J.y = 0), J.x = Math.max(Math.min(J.x, 99999), Je), J.y = Math.max(Math.min(J.y, 99999), Ge), J.start = J.x, setTimeout((function() {
		window.history.replaceState({}, document.title, location.pathname)
	}), 0), Nt(J.x, J.y), null != localStorage.getItem("zoom") && be(JSON.parse(localStorage.getItem("zoom")), !1), vn()
}();