/*! alluvial_diagram 02-11-2015 */
d3.alluvial = function() {
    function a() {
        function a(b, c) {
            if (c + 1 > d.length - 1) return [];
            var e = d[c + 1],
                f = e.filter(function(a) {
                    return b.key == a.key ? !0 : !1
                });
            return f.length < 1 ? (f = a(b, c + 1), c + 1 == d.length - 1 ? [] : f) : f
        }

        function k(a, b) {
            if (a.week < 1) return [];
            var c = d[b - 1],
                e = c.filter(function(b) {
                    return a.key == b.key ? !0 : !1
                });
            return e.length < 1 ? (e = k(a, b - 1), e.length < 1 && console.log("source - can't find team " + a.key + " in week " + (b - 1)), e) : e
        }
        c = [], b = [], d = [];
        var n;
        _data.forEach(function(a) {
            a.week > d.length - 1 && (d.push([]), n = 0), node = {}, node.key = a.away, node.value = a.away_prob, node.opponentValue = a.home_prob, node.gameKey = a.home + "_" + a.away + "_w" + a.week, node.week = a.week, node.opponent = a.home, node.game = a, node.win = a.away_prob >= .5 ? 1 : 0, node.totalWins = 0, node.type = "away", node.gameIndex = n, node.sourceLinks = [], node.targetLinks = [], b.push(node), d[node.week].push(node), node = {}, node.key = a.home, node.opponent = a.away, node.opponentValue = a.away_prob, node.gameKey = a.home + "_" + a.away + "_w" + a.week, node.value = a.home_prob, node.week = a.week, node.game = a, node.type = "home", node.win = a.home_prob >= .5 ? 1 : 0, node.gameIndex = n, node.totalWins = 0, node.sourceLinks = [], node.targetLinks = [], b.push(node), d[node.week].push(node), n++
        }), i = m[1] * j, h = (m[1] - d[0].length * i) / d[0].length, e = (m[0] - l) / (d.length - 1), f = h + i;
        var o = 0;
        d.forEach(function(a) {
            g.push(o * e), o++
        }), b.forEach(function(b) {
            b.sourceLinks = k(b, b.week), b.targetLinks = a(b, b.week), b.x = b.week * e, b.dx = l, b.value >= .5 ? b.y = (b.gameIndex - 1) * (h + i) : b.y = (b.gameIndex - 1) * (h + i) + h * (1 - b.value) + 1, b.dy = h * b.value
        }), b.forEach(function(b) {
            if (b.week < d.length - 1) {
                var e = a(b, b.week);
                if (e.length > 0) {
                    var f = {};
                    f.source = b, f.target = e[0], f.sy = f.source.y, f.ty = f.target.y, f.sdy = f.source.dy, f.tdy = f.target.dy, f.dy = b.dy, f.key = b.key, f.value = f.target.value, f.target.totalWins = f.source.totalWins + f.target.win, f.wins = f.target.totalWins, c.push(f)
                }
            }
        })
    }
    var b, c, d, e, f, g = [],
        h = 50,
        i = 10,
        j = .01,
        k = {},
        l = 8,
        i = 8,
        m = [1, 1],
        b = [],
        c = [];
    return k.data = function(a) {
        return arguments.length ? (_data = a, k) : _data
    }, k.nodeHeight = function(a) {
        return arguments.length ? k : h
    }, k.nodeWidth = function(a) {
        return arguments.length ? (l = +a, k) : l
    }, k.nodePadding = function(a) {
        return arguments.length ? (i = +a, k) : i
    }, k.nodes = function(a) {
        return arguments.length ? (b = a, k) : b
    }, k.links = function(a) {
        return arguments.length ? (c = a, k) : c
    }, k.size = function(a) {
        return arguments.length ? (m = a, k) : m
    }, k.hOffsets = function() {
        return g
    }, k.xOffset = function() {
        return e
    }, k.layout = function() {
        return a(), k
    }, k.relayout = function() {
        return k
    }, k.link = function() {
        function a(a) {
            var c = a.source.x + a.source.dx,
                d = a.target.x,
                e = d3.interpolateNumber(c, d),
                f = e(b),
                g = e(1 - b),
                h = a.source.y,
                i = a.target.y,
                j = "M " + c + "," + h + " C " + f + ", " + h + " " + g + ", " + i + " " + d + ", " + i + " L " + d + ", " + (i + a.tdy) + " C " + f + ", " + (i + a.tdy) + " " + f + ", " + (h + a.sdy) + " " + c + ", " + (h + a.sdy) + " L " + c + "," + h;
            return j
        }
        var b = .5;
        return a.curvature = function(c) {
            return arguments.length ? (b = +c, a) : b
        }, a
    }, k
}, main = function() {
    var a = 0,
        b = 0,
        c = .4,
        d = .1,
        e = 0,
        f = 1,
        g = 100,
        h = d3.select("#game"),
        i = (d3.select("#winner"), d3.select("#game_winner_name")),
        j = d3.select("#game_winner_img"),
        k = d3.select("#game_winner_prob"),
        l = (d3.select("#loser"), d3.select("#game_loser_name")),
        m = d3.select("#game_loser_img"),
        n = d3.select("#game_loser_prob"),
        o = window.innerWidth - 30,
        p = {
            top: 0,
            right: 50,
            bottom: 10,
            left: 50
        },
        q = Math.max(o, 800) - p.left - p.right,
        r = 1440 - p.top - p.bottom,
        s = (d3.format(",.0f"), d3.scale.category20(), d3.select("#chart").append("svg").style("overflow", "visible").attr("width", q + p.left + p.right).attr("height", r + p.top + p.bottom)),
        t = s.append("g").attr("transform", "translate(" + p.left + "," + p.top + ")"),
        u = s.append("g").attr("transform", "translate(" + p.left + "," + (p.top + g) + ")"),
        v = d3.alluvial().nodeWidth(8).nodePadding(10).size([q, r - g]),
        w = v.link();
    d3.json("data/nfl_teams.json", function(g, o) {
        var r = [],
            s = {};
        o.teams.forEach(function(a) {
            s[a.key] = a
        }), d3.csv("data/nfl_games.csv", function(g) {
            function o(a) {
                d3.selectAll("path." + a.key).transition().style("fill-opacity", .3), u.selectAll("rect").filter(function() {
                    return this.__data__.key != a.key
                }).transition().style("fill-opacity", d), u.selectAll("rect").filter(function() {
                    return this.__data__.opponent == a.key
                }).transition().style("fill-opacity", .25);
                u.selectAll("text." + a.key).data();
                u.selectAll("text").filter(function() {
                    return this.__data__.key != a.key && this.__data__.opponent != a.key
                }).transition().style("fill-opacity", d);
                h.style("top", function() {
                    var b = a.value > .49 ? a.y + p.top + 140 : a.y + p.top + 140 - (20 - a.dy);
                    return b + "px"
                }).style("left", function() {
                    return Math.min(q - 130, Math.max(a.x - 37, 20)) + "px"
                }), h.transition().style("opacity", 1);
                var b, c, e, f;
                a.value > .49 ? (b = s[a.key], c = s[a.opponent], e = a.value, f = a.opponentValue) : (b = s[a.opponent], c = s[a.key], e = a.opponentValue, f = a.value), i.text(b.name).style("color", b.color), k.text(Math.round(100 * e) + "%").style("color", b.color), j.attr("src", "assets/" + b.key + ".png"), l.text(c.name).style("color", c.color), n.text(Math.round(100 * f) + "%").style("color", c.color), m.attr("src", "assets/" + c.key + ".png"), t.selectAll(".weekLabel").transition().style("font-weight", function(b, c) {
                    return c == a.week || c == a.week + 17 ? "bold" : "normal"
                }).style("font-size", function(b, c) {
                    return c == a.week || c == a.week + 17 ? "16px" : "12px"
                })
            }

            function x(b) {
                d3.selectAll("path").transition().style("fill-opacity", a), u.selectAll("rect").transition().style("fill-opacity", function(a) {
                    return a.value < .5 ? c : .8
                }), u.selectAll("text").transition().style("fill-opacity", f), t.selectAll(".headerLabel").transition().style("opacity", 0), t.selectAll(".weekLabel").transition().style("font-weight", "normal").style("font-size", "12px"), h.transition().style("opacity", 0)
            }

            function y(a) {
                return s[a].color
            }
            r = [], g.forEach(function(a) {
                game = {}, game.week = Number(a.week), game.away = a.away, game.home = a.home, game.away_prob = Number(a.away_prob), game.home_prob = Number(a.home_prob), r.push(game)
            }), v.data(r).layout();
            var z = v.links(),
                A = v.nodes(),
                B = v.hOffsets(),
                C = t.selectAll(".topLabel").data(B).enter();
            C.append("text").style("fill", "#1976D2").style("font-weight", 400).style("text-anchor", "middle").attr("class", "weekLabel").attr("y", 15 - p.top).attr("x", function(a) {
                return a
            }).text("WEEK"), C.append("text").style("fill", "#1976D2").style("font-weight", 400).style("text-anchor", "middle").attr("class", "weekLabel").attr("y", 35 - p.top).attr("x", function(a) {
                return a
            }).text(function(a, b) {
                return b + 1
            });
            var D = (u.append("g").selectAll(".link").data(z).enter().append("path").attr("class", function(a) {
                return "link " + a.key
            }).attr("d", w).style("fill", function(a) {
                return y(a.key)
            }).style("fill-opacity", a).style("stroke", function(a) {
                return y(a.key)
            }).style("stroke-width", .5).style("stroke-opacity", b), u.append("g").selectAll(".node").data(A).enter().append("g").attr("class", "node").attr("transform", function(a) {
                return "translate(" + a.x + "," + a.y + ")"
            }));
            D.append("rect").attr("class", function(a) {
                return "game " + a.key + " " + a.gameKey
            }).attr("height", function(a) {
                return a.dy
            }).attr("width", v.nodeWidth()).style("fill", function(a) {
                return y(a.key)
            }).style("fill-opacity", function(a) {
                return a.value < .5 ? c : .8
            }).style("stroke", function(a) {
                return y(a.key)
            }).style("stroke-opacity", e).on("mouseover", function(a) {
                o(a)
            }).on("mouseout", function(a) {
                x(a)
            }), D.append("text").attr("x", -6).attr("class", function(a) {
                return "game " + a.gameKey + " " + a.key
            }).attr("y", function(a) {
                return a.dy / 2
            }).attr("dy", ".35em").style("font-weight", function(a) {
                return a.value < .5 ? 200 : 700
            }).style("fill-opacity", f).attr("text-anchor", "end").style("font-size", "10px").style("fill", function(a) {
                return y(a.key)
            }).attr("transform", null).text(function(a) {
                return a.key
            }).on("mouseover", function(a) {
                o(a)
            }).on("mouseout", function(a) {
                x(a)
            })
        })
    })
}();
