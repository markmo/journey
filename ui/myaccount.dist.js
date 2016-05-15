/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	__webpack_require__(1);

	var margin = {
	  top: 1,
	  right: 1,
	  bottom: 6,
	  left: 1
	},
	    width = 960 - margin.left - margin.right,
	    height = 500 - margin.top - margin.bottom;

	var svg = d3.select('#diagram').append('svg').attr('width', width + margin.left + margin.right).attr('height', height + margin.top + margin.bottom).append('g').attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

	var sankey = d3.sankey().nodeWidth(15).nodePadding(10).size([width, height]);

	var path = sankey.link();

	d3.json('data.json', function (data) {
	  sankey.nodes(data.nodes).links(data.links).layout(32);

	  var link = svg.append('g').selectAll('.link').data(energy.links).enter().append('path').attr('class', 'link').attr('d', path).style('stroke-width', function (d) {
	    return Math.max(1, d.dy);
	  }).sort(function (a, b) {
	    return b.dy - a.dy;
	  });

	  var node = svg.append('g').selectAll('.node').data(energy.nodes).enter().append('g').attr('class', 'node').attr('transform', function (d) {
	    return 'translate(' + d.x + ',' + d.y + ')';
	  });

	  node.append('rect').attr('height', function (d) {
	    return d.dy;
	  }).attr('width', sankey.nodeWidth()).style('fill', function (d) {
	    return d.color = color(d.name.replace(/ .*/, ''));
	  }).style('stroke', function (d) {
	    return d3.rgb(d.color).darker(2);
	  }).append('title').text(function (d) {
	    return d.name + '\n' + format(d.value);
	  });

	  node.append('text').attr('x', -6).attr('y', function (d) {
	    return d.dy / 2;
	  }).attr('dy', '.35em').attr('text-anchor', 'end').attr('transform', null).text(function (d) {
	    return d.name;
	  }).filter(function (d) {
	    return d.x < width / 2;
	  }).attr('x', 6 + sankey.nodeWidth()).attr('text-anchor', 'start');
	});

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;'use strict';

	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

	(function (global, factory) {
	  ( false ? 'undefined' : _typeof(exports)) === 'object' && typeof module !== 'undefined' ? factory(exports, __webpack_require__(2), __webpack_require__(3)) :  true ? !(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports, __webpack_require__(2), __webpack_require__(3)], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory), __WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ? (__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__)) : factory(global.d3_sankey = {}, global.d3_arrays, global.d3_interpolate);
	})(undefined, function (exports, d3Arrays, d3Interpolate) {
	  'use strict';

	  // Stolen from https://github.com/d3/d3-plugins/tree/master/sankey

	  function sankey() {
	    var sankey = {},
	        nodeWidth = 24,
	        nodePadding = 8,
	        size = [1, 1],
	        nodes = [],
	        links = [];

	    sankey.nodeWidth = function (_) {
	      if (!arguments.length) return nodeWidth;
	      nodeWidth = +_;
	      return sankey;
	    };

	    sankey.nodePadding = function (_) {
	      if (!arguments.length) return nodePadding;
	      nodePadding = +_;
	      return sankey;
	    };

	    sankey.nodes = function (_) {
	      if (!arguments.length) return nodes;
	      nodes = _;
	      return sankey;
	    };

	    sankey.links = function (_) {
	      if (!arguments.length) return links;
	      links = _;
	      return sankey;
	    };

	    sankey.size = function (_) {
	      if (!arguments.length) return size;
	      size = _;
	      return sankey;
	    };

	    sankey.layout = function (iterations) {
	      computeNodeLinks();
	      computeNodeValues();
	      computeNodeBreadths();
	      computeNodeDepths(iterations);
	      computeLinkDepths();
	      return sankey;
	    };

	    sankey.relayout = function () {
	      computeLinkDepths();
	      return sankey;
	    };

	    sankey.link = function () {
	      var curvature = .5;

	      function link(d) {
	        var x0 = d.source.x + d.source.dx,
	            x1 = d.target.x,
	            xi = d3Interpolate.number(x0, x1),
	            x2 = xi(curvature),
	            x3 = xi(1 - curvature),
	            y0 = d.source.y + d.sy + d.dy / 2,
	            y1 = d.target.y + d.ty + d.dy / 2;
	        return "M" + x0 + "," + y0 + "C" + x2 + "," + y0 + " " + x3 + "," + y1 + " " + x1 + "," + y1;
	      }

	      link.curvature = function (_) {
	        if (!arguments.length) return curvature;
	        curvature = +_;
	        return link;
	      };

	      return link;
	    };

	    // Populate the sourceLinks and targetLinks for each node.
	    // Also, if the source and target are not objects, assume they are indices.
	    function computeNodeLinks() {
	      nodes.forEach(function (node) {
	        node.sourceLinks = [];
	        node.targetLinks = [];
	      });
	      links.forEach(function (link) {
	        var source = link.source,
	            target = link.target;
	        if (typeof source === "number") source = link.source = nodes[link.source];
	        if (typeof target === "number") target = link.target = nodes[link.target];
	        source.sourceLinks.push(link);
	        target.targetLinks.push(link);
	      });
	    }

	    // Compute the value (size) of each node by summing the associated links.
	    function computeNodeValues() {
	      nodes.forEach(function (node) {
	        node.value = Math.max(d3Arrays.sum(node.sourceLinks, value), d3Arrays.sum(node.targetLinks, value));
	      });
	    }

	    // Iteratively assign the breadth (x-position) for each node.
	    // Nodes are assigned the maximum breadth of incoming neighbors plus one;
	    // nodes with no incoming links are assigned breadth zero, while
	    // nodes with no outgoing links are assigned the maximum breadth.
	    function computeNodeBreadths() {
	      var remainingNodes = nodes,
	          nextNodes,
	          x = 0;

	      while (remainingNodes.length) {
	        nextNodes = [];
	        remainingNodes.forEach(function (node) {
	          node.x = x;
	          node.dx = nodeWidth;
	          node.sourceLinks.forEach(function (link) {
	            if (nextNodes.indexOf(link.target) < 0) {
	              nextNodes.push(link.target);
	            }
	          });
	        });
	        remainingNodes = nextNodes;
	        ++x;
	      }

	      //
	      moveSinksRight(x);
	      scaleNodeBreadths((size[0] - nodeWidth) / (x - 1));
	    }

	    function moveSourcesRight() {
	      nodes.forEach(function (node) {
	        if (!node.targetLinks.length) {
	          node.x = d3Arrays.min(node.sourceLinks, function (d) {
	            return d.target.x;
	          }) - 1;
	        }
	      });
	    }

	    function moveSinksRight(x) {
	      nodes.forEach(function (node) {
	        if (!node.sourceLinks.length) {
	          node.x = x - 1;
	        }
	      });
	    }

	    function scaleNodeBreadths(kx) {
	      nodes.forEach(function (node) {
	        node.x *= kx;
	      });
	    }

	    function computeNodeDepths(iterations) {
	      var nodesByBreadth = d3Arrays.nest().key(function (d) {
	        return d.x;
	      }).sortKeys(d3Arrays.ascending).entries(nodes).map(function (d) {
	        return d.values;
	      });

	      //
	      initializeNodeDepth();
	      resolveCollisions();
	      for (var alpha = 1; iterations > 0; --iterations) {
	        relaxRightToLeft(alpha *= .99);
	        resolveCollisions();
	        relaxLeftToRight(alpha);
	        resolveCollisions();
	      }

	      function initializeNodeDepth() {
	        var ky = d3Arrays.min(nodesByBreadth, function (nodes) {
	          return (size[1] - (nodes.length - 1) * nodePadding) / d3Arrays.sum(nodes, value);
	        });

	        nodesByBreadth.forEach(function (nodes) {
	          nodes.forEach(function (node, i) {
	            node.y = i;
	            node.dy = node.value * ky;
	          });
	        });

	        links.forEach(function (link) {
	          link.dy = link.value * ky;
	        });
	      }

	      function relaxLeftToRight(alpha) {
	        nodesByBreadth.forEach(function (nodes, breadth) {
	          nodes.forEach(function (node) {
	            if (node.targetLinks.length) {
	              var y = d3Arrays.sum(node.targetLinks, weightedSource) / d3Arrays.sum(node.targetLinks, value);
	              node.y += (y - center(node)) * alpha;
	            }
	          });
	        });

	        function weightedSource(link) {
	          return center(link.source) * link.value;
	        }
	      }

	      function relaxRightToLeft(alpha) {
	        nodesByBreadth.slice().reverse().forEach(function (nodes) {
	          nodes.forEach(function (node) {
	            if (node.sourceLinks.length) {
	              var y = d3Arrays.sum(node.sourceLinks, weightedTarget) / d3Arrays.sum(node.sourceLinks, value);
	              node.y += (y - center(node)) * alpha;
	            }
	          });
	        });

	        function weightedTarget(link) {
	          return center(link.target) * link.value;
	        }
	      }

	      function resolveCollisions() {
	        nodesByBreadth.forEach(function (nodes) {
	          var node,
	              dy,
	              y0 = 0,
	              n = nodes.length,
	              i;

	          // Push any overlapping nodes down.
	          nodes.sort(ascendingDepth);
	          for (i = 0; i < n; ++i) {
	            node = nodes[i];
	            dy = y0 - node.y;
	            if (dy > 0) node.y += dy;
	            y0 = node.y + node.dy + nodePadding;
	          }

	          // If the bottommost node goes outside the bounds, push it back up.
	          dy = y0 - nodePadding - size[1];
	          if (dy > 0) {
	            y0 = node.y -= dy;

	            // Push any overlapping nodes back up.
	            for (i = n - 2; i >= 0; --i) {
	              node = nodes[i];
	              dy = node.y + node.dy + nodePadding - y0;
	              if (dy > 0) node.y -= dy;
	              y0 = node.y;
	            }
	          }
	        });
	      }

	      function ascendingDepth(a, b) {
	        return a.y - b.y;
	      }
	    }

	    function computeLinkDepths() {
	      nodes.forEach(function (node) {
	        node.sourceLinks.sort(ascendingTargetDepth);
	        node.targetLinks.sort(ascendingSourceDepth);
	      });
	      nodes.forEach(function (node) {
	        var sy = 0,
	            ty = 0;
	        node.sourceLinks.forEach(function (link) {
	          link.sy = sy;
	          sy += link.dy;
	        });
	        node.targetLinks.forEach(function (link) {
	          link.ty = ty;
	          ty += link.dy;
	        });
	      });

	      function ascendingSourceDepth(a, b) {
	        return a.source.y - b.source.y;
	      }

	      function ascendingTargetDepth(a, b) {
	        return a.target.y - b.target.y;
	      }
	    }

	    function center(node) {
	      return node.y + node.dy / 2;
	    }

	    function value(link) {
	      return link.value;
	    }

	    return sankey;
	  };

	  var version = "0.2.0";

	  exports.version = version;
	  exports.sankey = sankey;
	});

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;'use strict';

	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

	(function (global, factory) {
	  ( false ? 'undefined' : _typeof(exports)) === 'object' && typeof module !== 'undefined' ? factory(exports) :  true ? !(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory), __WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ? (__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__)) : factory(global.d3_arrays = {});
	})(undefined, function (exports) {
	  'use strict';

	  function ascending(a, b) {
	    return a < b ? -1 : a > b ? 1 : a >= b ? 0 : NaN;
	  };

	  function bisector(compare) {
	    if (compare.length === 1) compare = ascendingComparator(compare);
	    return {
	      left: function left(a, x, lo, hi) {
	        if (arguments.length < 3) lo = 0;
	        if (arguments.length < 4) hi = a.length;
	        while (lo < hi) {
	          var mid = lo + hi >>> 1;
	          if (compare(a[mid], x) < 0) lo = mid + 1;else hi = mid;
	        }
	        return lo;
	      },
	      right: function right(a, x, lo, hi) {
	        if (arguments.length < 3) lo = 0;
	        if (arguments.length < 4) hi = a.length;
	        while (lo < hi) {
	          var mid = lo + hi >>> 1;
	          if (compare(a[mid], x) > 0) hi = mid;else lo = mid + 1;
	        }
	        return lo;
	      }
	    };
	  };

	  function ascendingComparator(f) {
	    return function (d, x) {
	      return ascending(f(d), x);
	    };
	  }

	  var ascendingBisect = bisector(ascending);
	  var bisectRight = ascendingBisect.right;
	  var bisectLeft = ascendingBisect.left;

	  function descending(a, b) {
	    return b < a ? -1 : b > a ? 1 : b >= a ? 0 : NaN;
	  };

	  function number(x) {
	    return x === null ? NaN : +x;
	  };

	  function variance(array, f) {
	    var n = array.length,
	        m = 0,
	        a,
	        d,
	        s = 0,
	        i = -1,
	        j = 0;

	    if (arguments.length === 1) {
	      while (++i < n) {
	        if (!isNaN(a = number(array[i]))) {
	          d = a - m;
	          m += d / ++j;
	          s += d * (a - m);
	        }
	      }
	    } else {
	      while (++i < n) {
	        if (!isNaN(a = number(f(array[i], i, array)))) {
	          d = a - m;
	          m += d / ++j;
	          s += d * (a - m);
	        }
	      }
	    }

	    if (j > 1) return s / (j - 1);
	  };

	  function deviation() {
	    var v = variance.apply(this, arguments);
	    return v ? Math.sqrt(v) : v;
	  };

	  function entries(map) {
	    var entries = [];
	    for (var key in map) {
	      entries.push({ key: key, value: map[key] });
	    }return entries;
	  };

	  function extent(array, f) {
	    var i = -1,
	        n = array.length,
	        a,
	        b,
	        c;

	    if (arguments.length === 1) {
	      while (++i < n) {
	        if ((b = array[i]) != null && b >= b) {
	          a = c = b;break;
	        }
	      }while (++i < n) {
	        if ((b = array[i]) != null) {
	          if (a > b) a = b;
	          if (c < b) c = b;
	        }
	      }
	    } else {
	      while (++i < n) {
	        if ((b = f(array[i], i, array)) != null && b >= b) {
	          a = c = b;break;
	        }
	      }while (++i < n) {
	        if ((b = f(array[i], i, array)) != null) {
	          if (a > b) a = b;
	          if (c < b) c = b;
	        }
	      }
	    }

	    return [a, c];
	  };

	  function keys(map) {
	    var keys = [];
	    for (var key in map) {
	      keys.push(key);
	    }return keys;
	  };

	  var prefix = "$";

	  function Map() {}

	  Map.prototype = map.prototype = {
	    has: function has(key) {
	      return prefix + key in this;
	    },
	    get: function get(key) {
	      return this[prefix + key];
	    },
	    set: function set(key, value) {
	      this[prefix + key] = value;
	      return this;
	    },
	    remove: function remove(key) {
	      var property = prefix + key;
	      return property in this && delete this[property];
	    },
	    clear: function clear() {
	      for (var property in this) {
	        if (property[0] === prefix) delete this[property];
	      }
	    },
	    keys: function keys() {
	      var keys = [];
	      for (var property in this) {
	        if (property[0] === prefix) keys.push(property.slice(1));
	      }return keys;
	    },
	    values: function values() {
	      var values = [];
	      for (var property in this) {
	        if (property[0] === prefix) values.push(this[property]);
	      }return values;
	    },
	    entries: function entries() {
	      var entries = [];
	      for (var property in this) {
	        if (property[0] === prefix) entries.push({ key: property.slice(1), value: this[property] });
	      }return entries;
	    },
	    size: function size() {
	      var size = 0;
	      for (var property in this) {
	        if (property[0] === prefix) ++size;
	      }return size;
	    },
	    empty: function empty() {
	      for (var property in this) {
	        if (property[0] === prefix) return false;
	      }return true;
	    },
	    each: function each(f) {
	      for (var property in this) {
	        if (property[0] === prefix) f(this[property], property.slice(1), this);
	      }
	    }
	  };

	  function map(object, f) {
	    var map = new Map();

	    // Copy constructor.
	    if (object instanceof Map) object.each(function (value, key) {
	      map.set(key, value);
	    });

	    // Index array by numeric index or specified key function.
	    else if (Array.isArray(object)) {
	        var i = -1,
	            n = object.length,
	            o;

	        if (arguments.length === 1) while (++i < n) {
	          map.set(i, object[i]);
	        } else while (++i < n) {
	          map.set(f(o = object[i], i, object), o);
	        }
	      }

	      // Convert object to map.
	      else if (object) for (var key in object) {
	          map.set(key, object[key]);
	        }return map;
	  }

	  function max(array, f) {
	    var i = -1,
	        n = array.length,
	        a,
	        b;

	    if (arguments.length === 1) {
	      while (++i < n) {
	        if ((b = array[i]) != null && b >= b) {
	          a = b;break;
	        }
	      }while (++i < n) {
	        if ((b = array[i]) != null && b > a) a = b;
	      }
	    } else {
	      while (++i < n) {
	        if ((b = f(array[i], i, array)) != null && b >= b) {
	          a = b;break;
	        }
	      }while (++i < n) {
	        if ((b = f(array[i], i, array)) != null && b > a) a = b;
	      }
	    }

	    return a;
	  };

	  function mean(array, f) {
	    var s = 0,
	        n = array.length,
	        a,
	        i = -1,
	        j = n;

	    if (arguments.length === 1) {
	      while (++i < n) {
	        if (!isNaN(a = number(array[i]))) s += a;else --j;
	      }
	    } else {
	      while (++i < n) {
	        if (!isNaN(a = number(f(array[i], i, array)))) s += a;else --j;
	      }
	    }

	    if (j) return s / j;
	  };

	  // R-7 per <http://en.wikipedia.org/wiki/Quantile>
	  function quantile(values, p) {
	    var H = (values.length - 1) * p + 1,
	        h = Math.floor(H),
	        v = +values[h - 1],
	        e = H - h;
	    return e ? v + e * (values[h] - v) : v;
	  };

	  function median(array, f) {
	    var numbers = [],
	        n = array.length,
	        a,
	        i = -1;

	    if (arguments.length === 1) {
	      while (++i < n) {
	        if (!isNaN(a = number(array[i]))) numbers.push(a);
	      }
	    } else {
	      while (++i < n) {
	        if (!isNaN(a = number(f(array[i], i, array)))) numbers.push(a);
	      }
	    }

	    if (numbers.length) return quantile(numbers.sort(ascending), .5);
	  };

	  function merge(arrays) {
	    var n = arrays.length,
	        m,
	        i = -1,
	        j = 0,
	        merged,
	        array;

	    while (++i < n) {
	      j += arrays[i].length;
	    }merged = new Array(j);

	    while (--n >= 0) {
	      array = arrays[n];
	      m = array.length;
	      while (--m >= 0) {
	        merged[--j] = array[m];
	      }
	    }

	    return merged;
	  };

	  function min(array, f) {
	    var i = -1,
	        n = array.length,
	        a,
	        b;

	    if (arguments.length === 1) {
	      while (++i < n) {
	        if ((b = array[i]) != null && b >= b) {
	          a = b;break;
	        }
	      }while (++i < n) {
	        if ((b = array[i]) != null && a > b) a = b;
	      }
	    } else {
	      while (++i < n) {
	        if ((b = f(array[i], i, array)) != null && b >= b) {
	          a = b;break;
	        }
	      }while (++i < n) {
	        if ((b = f(array[i], i, array)) != null && a > b) a = b;
	      }
	    }

	    return a;
	  };

	  function nest() {
	    var keys = [],
	        _sortKeys = [],
	        _sortValues,
	        _rollup,
	        nest;

	    function apply(array, depth, createResult, setResult) {
	      if (depth >= keys.length) return _rollup ? _rollup(array) : _sortValues ? array.sort(_sortValues) : array;

	      var i = -1,
	          n = array.length,
	          key = keys[depth++],
	          keyValue,
	          value,
	          valuesByKey = map(),
	          values,
	          result = createResult();

	      while (++i < n) {
	        if (values = valuesByKey.get(keyValue = key(value = array[i]) + "")) {
	          values.push(value);
	        } else {
	          valuesByKey.set(keyValue, [value]);
	        }
	      }

	      valuesByKey.each(function (values, key) {
	        setResult(result, key, apply(values, depth, createResult, setResult));
	      });

	      return result;
	    }

	    function _entries(map, depth) {
	      if (depth >= keys.length) return map;

	      var array = [],
	          sortKey = _sortKeys[depth++];

	      map.each(function (value, key) {
	        array.push({ key: key, values: _entries(value, depth) });
	      });

	      return sortKey ? array.sort(function (a, b) {
	        return sortKey(a.key, b.key);
	      }) : array;
	    }

	    return nest = {
	      object: function object(array) {
	        return apply(array, 0, createObject, setObject);
	      },
	      map: function map(array) {
	        return apply(array, 0, createMap, setMap);
	      },
	      entries: function entries(array) {
	        return _entries(apply(array, 0, createMap, setMap), 0);
	      },
	      key: function key(d) {
	        keys.push(d);return nest;
	      },
	      sortKeys: function sortKeys(order) {
	        _sortKeys[keys.length - 1] = order;return nest;
	      },
	      sortValues: function sortValues(order) {
	        _sortValues = order;return nest;
	      },
	      rollup: function rollup(f) {
	        _rollup = f;return nest;
	      }
	    };
	  };

	  function createObject() {
	    return {};
	  }

	  function setObject(object, key, value) {
	    object[key] = value;
	  }

	  function createMap() {
	    return map();
	  }

	  function setMap(map, key, value) {
	    map.set(key, value);
	  }

	  function pairs(array) {
	    var i = 0,
	        n = array.length - 1,
	        p0,
	        p1 = array[0],
	        pairs = new Array(n < 0 ? 0 : n);
	    while (i < n) {
	      pairs[i] = [p0 = p1, p1 = array[++i]];
	    }return pairs;
	  };

	  function permute(array, indexes) {
	    var i = indexes.length,
	        permutes = new Array(i);
	    while (i--) {
	      permutes[i] = array[indexes[i]];
	    }return permutes;
	  };

	  function range(start, stop, step) {
	    if ((n = arguments.length) < 3) {
	      step = 1;
	      if (n < 2) {
	        stop = start;
	        start = 0;
	      }
	    }

	    var i = -1,
	        n = Math.max(0, Math.ceil((stop - start) / step)) | 0,
	        range = new Array(n);

	    while (++i < n) {
	      range[i] = start + i * step;
	    }

	    return range;
	  };

	  function Set() {}

	  var proto = map.prototype;

	  Set.prototype = set.prototype = {
	    has: proto.has,
	    add: function add(value) {
	      value += "";
	      this[prefix + value] = value;
	      return this;
	    },
	    remove: proto.remove,
	    clear: proto.clear,
	    values: proto.keys,
	    size: proto.size,
	    empty: proto.empty,
	    each: proto.each
	  };

	  function set(object) {
	    var set = new Set();

	    // Copy constructor.
	    if (object instanceof Set) object.each(function (value) {
	      set.add(value);
	    });

	    // Otherwise, assume it’s an array.
	    else if (object) for (var i = 0, n = object.length; i < n; ++i) {
	        set.add(object[i]);
	      }return set;
	  }

	  function shuffle(array, i0, i1) {
	    if ((m = arguments.length) < 3) {
	      i1 = array.length;
	      if (m < 2) i0 = 0;
	    }

	    var m = i1 - i0,
	        t,
	        i;

	    while (m) {
	      i = Math.random() * m-- | 0;
	      t = array[m + i0];
	      array[m + i0] = array[i + i0];
	      array[i + i0] = t;
	    }

	    return array;
	  };

	  function sum(array, f) {
	    var s = 0,
	        n = array.length,
	        a,
	        i = -1;

	    if (arguments.length === 1) {
	      while (++i < n) {
	        if (!isNaN(a = +array[i])) s += a;
	      } // Note: zero and null are equivalent.
	    } else {
	        while (++i < n) {
	          if (!isNaN(a = +f(array[i], i, array))) s += a;
	        }
	      }

	    return s;
	  };

	  function transpose(matrix) {
	    if (!(n = matrix.length)) return [];
	    for (var i = -1, m = min(matrix, length), transpose = new Array(m); ++i < m;) {
	      for (var j = -1, n, row = transpose[i] = new Array(n); ++j < n;) {
	        row[j] = matrix[j][i];
	      }
	    }
	    return transpose;
	  };

	  function length(d) {
	    return d.length;
	  }

	  function values(map) {
	    var values = [];
	    for (var key in map) {
	      values.push(map[key]);
	    }return values;
	  };

	  function zip() {
	    return transpose(arguments);
	  };

	  var version = "0.4.1";

	  exports.version = version;
	  exports.bisect = bisectRight;
	  exports.bisectRight = bisectRight;
	  exports.bisectLeft = bisectLeft;
	  exports.ascending = ascending;
	  exports.bisector = bisector;
	  exports.descending = descending;
	  exports.deviation = deviation;
	  exports.entries = entries;
	  exports.extent = extent;
	  exports.keys = keys;
	  exports.map = map;
	  exports.max = max;
	  exports.mean = mean;
	  exports.median = median;
	  exports.merge = merge;
	  exports.min = min;
	  exports.nest = nest;
	  exports.pairs = pairs;
	  exports.permute = permute;
	  exports.quantile = quantile;
	  exports.range = range;
	  exports.set = set;
	  exports.shuffle = shuffle;
	  exports.sum = sum;
	  exports.transpose = transpose;
	  exports.values = values;
	  exports.variance = variance;
	  exports.zip = zip;
	});

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;'use strict';

	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

	(function (global, factory) {
	  ( false ? 'undefined' : _typeof(exports)) === 'object' && typeof module !== 'undefined' ? factory(exports, __webpack_require__(4)) :  true ? !(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports, __webpack_require__(4)], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory), __WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ? (__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__)) : factory(global.d3_interpolate = {}, global.d3_color);
	})(undefined, function (exports, d3Color) {
	  'use strict';

	  function deltaHue(h1, h0) {
	    var delta = h1 - h0;
	    return delta > 180 || delta < -180 ? delta - 360 * Math.round(delta / 360) : delta;
	  };

	  function cubehelixGamma(gamma) {
	    return function (a, b) {
	      a = d3Color.cubehelix(a);
	      b = d3Color.cubehelix(b);
	      var ah = isNaN(a.h) ? b.h : a.h,
	          as = isNaN(a.s) ? b.s : a.s,
	          al = a.l,
	          bh = isNaN(b.h) ? 0 : deltaHue(b.h, ah),
	          bs = isNaN(b.s) ? 0 : b.s - as,
	          bl = b.l - al;
	      return function (t) {
	        a.h = ah + bh * t;
	        a.s = as + bs * t;
	        a.l = al + bl * Math.pow(t, gamma);
	        return a + "";
	      };
	    };
	  };

	  function cubehelixGammaLong(gamma) {
	    return function (a, b) {
	      a = d3Color.cubehelix(a);
	      b = d3Color.cubehelix(b);
	      var ah = isNaN(a.h) ? b.h : a.h,
	          as = isNaN(a.s) ? b.s : a.s,
	          al = a.l,
	          bh = isNaN(b.h) ? 0 : b.h - ah,
	          bs = isNaN(b.s) ? 0 : b.s - as,
	          bl = b.l - al;
	      return function (t) {
	        a.h = ah + bh * t;
	        a.s = as + bs * t;
	        a.l = al + bl * Math.pow(t, gamma);
	        return a + "";
	      };
	    };
	  };

	  function rgb(a, b) {
	    a = d3Color.rgb(a);
	    b = d3Color.rgb(b);
	    var ar = a.r,
	        ag = a.g,
	        ab = a.b,
	        br = b.r - ar,
	        bg = b.g - ag,
	        bb = b.b - ab;
	    return function (t) {
	      a.r = ar + br * t;
	      a.g = ag + bg * t;
	      a.b = ab + bb * t;
	      return a + "";
	    };
	  };

	  function number(a, b) {
	    return a = +a, b -= a, function (t) {
	      return a + b * t;
	    };
	  };

	  function object(a, b) {
	    var i = {},
	        c = {},
	        k;

	    for (k in a) {
	      if (k in b) {
	        i[k] = value(a[k], b[k]);
	      } else {
	        c[k] = a[k];
	      }
	    }

	    for (k in b) {
	      if (!(k in a)) {
	        c[k] = b[k];
	      }
	    }

	    return function (t) {
	      for (k in i) {
	        c[k] = i[k](t);
	      }return c;
	    };
	  };

	  var reA = /[-+]?(?:\d+\.?\d*|\.?\d+)(?:[eE][-+]?\d+)?/g;
	  var reB = new RegExp(reA.source, "g");
	  function zero(b) {
	    return function () {
	      return b;
	    };
	  }

	  function one(b) {
	    return function (t) {
	      return b(t) + "";
	    };
	  }

	  function string(a, b) {
	    var bi = reA.lastIndex = reB.lastIndex = 0,
	        // scan index for next number in b
	    am,
	        // current match in a
	    bm,
	        // current match in b
	    bs,
	        // string preceding current number in b, if any
	    i = -1,
	        // index in s
	    s = [],
	        // string constants and placeholders
	    q = []; // number interpolators

	    // Coerce inputs to strings.
	    a = a + "", b = b + "";

	    // Interpolate pairs of numbers in a & b.
	    while ((am = reA.exec(a)) && (bm = reB.exec(b))) {
	      if ((bs = bm.index) > bi) {
	        // a string precedes the next number in b
	        bs = b.slice(bi, bs);
	        if (s[i]) s[i] += bs; // coalesce with previous string
	        else s[++i] = bs;
	      }
	      if ((am = am[0]) === (bm = bm[0])) {
	        // numbers in a & b match
	        if (s[i]) s[i] += bm; // coalesce with previous string
	        else s[++i] = bm;
	      } else {
	        // interpolate non-matching numbers
	        s[++i] = null;
	        q.push({ i: i, x: number(am, bm) });
	      }
	      bi = reB.lastIndex;
	    }

	    // Add remains of b.
	    if (bi < b.length) {
	      bs = b.slice(bi);
	      if (s[i]) s[i] += bs; // coalesce with previous string
	      else s[++i] = bs;
	    }

	    // Special optimization for only a single match.
	    // Otherwise, interpolate each of the numbers and rejoin the string.
	    return s.length < 2 ? q[0] ? one(q[0].x) : zero(b) : (b = q.length, function (t) {
	      for (var i = 0, o; i < b; ++i) {
	        s[(o = q[i]).i] = o.x(t);
	      }return s.join("");
	    });
	  };

	  var values = [function (a, b) {
	    var t = typeof b === 'undefined' ? 'undefined' : _typeof(b),
	        c;
	    return (t === "string" ? (c = d3Color.color(b)) ? (b = c, rgb) : string : b instanceof d3Color.color ? rgb : Array.isArray(b) ? array : t === "object" && isNaN(b) ? object : number)(a, b);
	  }];

	  function value(a, b) {
	    var i = values.length,
	        f;
	    while (--i >= 0 && !(f = values[i](a, b))) {}
	    return f;
	  };

	  // TODO sparse arrays?
	  function array(a, b) {
	    var x = [],
	        c = [],
	        na = a.length,
	        nb = b.length,
	        n0 = Math.min(a.length, b.length),
	        i;

	    for (i = 0; i < n0; ++i) {
	      x.push(value(a[i], b[i]));
	    }for (; i < na; ++i) {
	      c[i] = a[i];
	    }for (; i < nb; ++i) {
	      c[i] = b[i];
	    }return function (t) {
	      for (i = 0; i < n0; ++i) {
	        c[i] = x[i](t);
	      }return c;
	    };
	  };

	  function round(a, b) {
	    return a = +a, b -= a, function (t) {
	      return Math.round(a + b * t);
	    };
	  };

	  var rad2deg = 180 / Math.PI;
	  var identity = { a: 1, b: 0, c: 0, d: 1, e: 0, f: 0 };
	  var g;
	  // Compute x-scale and normalize the first row.
	  // Compute shear and make second row orthogonal to first.
	  // Compute y-scale and normalize the second row.
	  // Finally, compute the rotation.
	  function Transform(string) {
	    if (!g) g = document.createElementNS("http://www.w3.org/2000/svg", "g");
	    if (string) g.setAttribute("transform", string), t = g.transform.baseVal.consolidate();

	    var t,
	        m = t ? t.matrix : identity,
	        r0 = [m.a, m.b],
	        r1 = [m.c, m.d],
	        kx = normalize(r0),
	        kz = dot(r0, r1),
	        ky = normalize(combine(r1, r0, -kz)) || 0;

	    if (r0[0] * r1[1] < r1[0] * r0[1]) {
	      r0[0] *= -1;
	      r0[1] *= -1;
	      kx *= -1;
	      kz *= -1;
	    }

	    this.rotate = (kx ? Math.atan2(r0[1], r0[0]) : Math.atan2(-r1[0], r1[1])) * rad2deg;
	    this.translate = [m.e, m.f];
	    this.scale = [kx, ky];
	    this.skew = ky ? Math.atan2(kz, ky) * rad2deg : 0;
	  }

	  function dot(a, b) {
	    return a[0] * b[0] + a[1] * b[1];
	  }

	  function normalize(a) {
	    var k = Math.sqrt(dot(a, a));
	    if (k) a[0] /= k, a[1] /= k;
	    return k;
	  }

	  function combine(a, b, k) {
	    a[0] += k * b[0];
	    a[1] += k * b[1];
	    return a;
	  }

	  function pop(s) {
	    return s.length ? s.pop() + "," : "";
	  }

	  function translate(ta, tb, s, q) {
	    if (ta[0] !== tb[0] || ta[1] !== tb[1]) {
	      var i = s.push("translate(", null, ",", null, ")");
	      q.push({ i: i - 4, x: number(ta[0], tb[0]) }, { i: i - 2, x: number(ta[1], tb[1]) });
	    } else if (tb[0] || tb[1]) {
	      s.push("translate(" + tb + ")");
	    }
	  }

	  function rotate(ra, rb, s, q) {
	    if (ra !== rb) {
	      if (ra - rb > 180) rb += 360;else if (rb - ra > 180) ra += 360; // shortest path
	      q.push({ i: s.push(pop(s) + "rotate(", null, ")") - 2, x: number(ra, rb) });
	    } else if (rb) {
	      s.push(pop(s) + "rotate(" + rb + ")");
	    }
	  }

	  function skew(wa, wb, s, q) {
	    if (wa !== wb) {
	      q.push({ i: s.push(pop(s) + "skewX(", null, ")") - 2, x: number(wa, wb) });
	    } else if (wb) {
	      s.push(pop(s) + "skewX(" + wb + ")");
	    }
	  }

	  function scale(ka, kb, s, q) {
	    if (ka[0] !== kb[0] || ka[1] !== kb[1]) {
	      var i = s.push(pop(s) + "scale(", null, ",", null, ")");
	      q.push({ i: i - 4, x: number(ka[0], kb[0]) }, { i: i - 2, x: number(ka[1], kb[1]) });
	    } else if (kb[0] !== 1 || kb[1] !== 1) {
	      s.push(pop(s) + "scale(" + kb + ")");
	    }
	  }

	  function transform(a, b) {
	    var s = [],
	        // string constants and placeholders
	    q = []; // number interpolators
	    a = new Transform(a), b = new Transform(b);
	    translate(a.translate, b.translate, s, q);
	    rotate(a.rotate, b.rotate, s, q);
	    skew(a.skew, b.skew, s, q);
	    scale(a.scale, b.scale, s, q);
	    a = b = null; // gc
	    return function (t) {
	      var i = -1,
	          n = q.length,
	          o;
	      while (++i < n) {
	        s[(o = q[i]).i] = o.x(t);
	      }return s.join("");
	    };
	  };

	  var rho = Math.SQRT2;
	  var rho2 = 2;
	  var rho4 = 4;
	  var epsilon2 = 1e-12;
	  function cosh(x) {
	    return ((x = Math.exp(x)) + 1 / x) / 2;
	  }

	  function sinh(x) {
	    return ((x = Math.exp(x)) - 1 / x) / 2;
	  }

	  function tanh(x) {
	    return ((x = Math.exp(2 * x)) - 1) / (x + 1);
	  }

	  // p0 = [ux0, uy0, w0]
	  // p1 = [ux1, uy1, w1]
	  function zoom(p0, p1) {
	    var ux0 = p0[0],
	        uy0 = p0[1],
	        w0 = p0[2],
	        ux1 = p1[0],
	        uy1 = p1[1],
	        w1 = p1[2],
	        dx = ux1 - ux0,
	        dy = uy1 - uy0,
	        d2 = dx * dx + dy * dy,
	        i,
	        S;

	    // Special case for u0 ≅ u1.
	    if (d2 < epsilon2) {
	      S = Math.log(w1 / w0) / rho;
	      i = function i(t) {
	        return [ux0 + t * dx, uy0 + t * dy, w0 * Math.exp(rho * t * S)];
	      };
	    }

	    // General case.
	    else {
	        var d1 = Math.sqrt(d2),
	            b0 = (w1 * w1 - w0 * w0 + rho4 * d2) / (2 * w0 * rho2 * d1),
	            b1 = (w1 * w1 - w0 * w0 - rho4 * d2) / (2 * w1 * rho2 * d1),
	            r0 = Math.log(Math.sqrt(b0 * b0 + 1) - b0),
	            r1 = Math.log(Math.sqrt(b1 * b1 + 1) - b1);
	        S = (r1 - r0) / rho;
	        i = function i(t) {
	          var s = t * S,
	              coshr0 = cosh(r0),
	              u = w0 / (rho2 * d1) * (coshr0 * tanh(rho * s + r0) - sinh(r0));
	          return [ux0 + u * dx, uy0 + u * dy, w0 * coshr0 / cosh(rho * s + r0)];
	        };
	      }

	    i.duration = S * 1000;

	    return i;
	  };

	  function hsl(a, b) {
	    a = d3Color.hsl(a);
	    b = d3Color.hsl(b);
	    var ah = isNaN(a.h) ? b.h : a.h,
	        as = isNaN(a.s) ? b.s : a.s,
	        al = a.l,
	        bh = isNaN(b.h) ? 0 : deltaHue(b.h, ah),
	        bs = isNaN(b.s) ? 0 : b.s - as,
	        bl = b.l - al;
	    return function (t) {
	      a.h = ah + bh * t;
	      a.s = as + bs * t;
	      a.l = al + bl * t;
	      return a + "";
	    };
	  };

	  function hslLong(a, b) {
	    a = d3Color.hsl(a);
	    b = d3Color.hsl(b);
	    var ah = isNaN(a.h) ? b.h : a.h,
	        as = isNaN(a.s) ? b.s : a.s,
	        al = a.l,
	        bh = isNaN(b.h) ? 0 : b.h - ah,
	        bs = isNaN(b.s) ? 0 : b.s - as,
	        bl = b.l - al;
	    return function (t) {
	      a.h = ah + bh * t;
	      a.s = as + bs * t;
	      a.l = al + bl * t;
	      return a + "";
	    };
	  };

	  function lab(a, b) {
	    a = d3Color.lab(a);
	    b = d3Color.lab(b);
	    var al = a.l,
	        aa = a.a,
	        ab = a.b,
	        bl = b.l - al,
	        ba = b.a - aa,
	        bb = b.b - ab;
	    return function (t) {
	      a.l = al + bl * t;
	      a.a = aa + ba * t;
	      a.b = ab + bb * t;
	      return a + "";
	    };
	  };

	  function hcl(a, b) {
	    a = d3Color.hcl(a);
	    b = d3Color.hcl(b);
	    var ah = isNaN(a.h) ? b.h : a.h,
	        ac = isNaN(a.c) ? b.c : a.c,
	        al = a.l,
	        bh = isNaN(b.h) ? 0 : deltaHue(b.h, ah),
	        bc = isNaN(b.c) ? 0 : b.c - ac,
	        bl = b.l - al;
	    return function (t) {
	      a.h = ah + bh * t;
	      a.c = ac + bc * t;
	      a.l = al + bl * t;
	      return a + "";
	    };
	  };

	  function hclLong(a, b) {
	    a = d3Color.hcl(a);
	    b = d3Color.hcl(b);
	    var ah = isNaN(a.h) ? b.h : a.h,
	        ac = isNaN(a.c) ? b.c : a.c,
	        al = a.l,
	        bh = isNaN(b.h) ? 0 : b.h - ah,
	        bc = isNaN(b.c) ? 0 : b.c - ac,
	        bl = b.l - al;
	    return function (t) {
	      a.h = ah + bh * t;
	      a.c = ac + bc * t;
	      a.l = al + bl * t;
	      return a + "";
	    };
	  };

	  var cubehelix = cubehelixGamma(1);
	  var cubehelixLong = cubehelixGammaLong(1);

	  var version = "0.2.1";

	  exports.version = version;
	  exports.cubehelix = cubehelix;
	  exports.cubehelixLong = cubehelixLong;
	  exports.cubehelixGamma = cubehelixGamma;
	  exports.cubehelixGammaLong = cubehelixGammaLong;
	  exports.array = array;
	  exports.number = number;
	  exports.object = object;
	  exports.round = round;
	  exports.string = string;
	  exports.transform = transform;
	  exports.values = values;
	  exports.value = value;
	  exports.zoom = zoom;
	  exports.rgb = rgb;
	  exports.hsl = hsl;
	  exports.hslLong = hslLong;
	  exports.lab = lab;
	  exports.hcl = hcl;
	  exports.hclLong = hclLong;
	});

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;'use strict';

	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

	(function (global, factory) {
	  ( false ? 'undefined' : _typeof(exports)) === 'object' && typeof module !== 'undefined' ? factory(exports) :  true ? !(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory), __WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ? (__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__)) : factory(global.d3_color = {});
	})(undefined, function (exports) {
	  'use strict';

	  function Color() {}

	  var darker = 0.7;
	  var brighter = 1 / darker;

	  var reHex3 = /^#([0-9a-f]{3})$/;
	  var reHex6 = /^#([0-9a-f]{6})$/;
	  var reRgbInteger = /^rgb\(\s*([-+]?\d+)\s*,\s*([-+]?\d+)\s*,\s*([-+]?\d+)\s*\)$/;
	  var reRgbPercent = /^rgb\(\s*([-+]?\d+(?:\.\d+)?)%\s*,\s*([-+]?\d+(?:\.\d+)?)%\s*,\s*([-+]?\d+(?:\.\d+)?)%\s*\)$/;
	  var reHslPercent = /^hsl\(\s*([-+]?\d+(?:\.\d+)?)\s*,\s*([-+]?\d+(?:\.\d+)?)%\s*,\s*([-+]?\d+(?:\.\d+)?)%\s*\)$/;
	  var named = {
	    aliceblue: 0xf0f8ff,
	    antiquewhite: 0xfaebd7,
	    aqua: 0x00ffff,
	    aquamarine: 0x7fffd4,
	    azure: 0xf0ffff,
	    beige: 0xf5f5dc,
	    bisque: 0xffe4c4,
	    black: 0x000000,
	    blanchedalmond: 0xffebcd,
	    blue: 0x0000ff,
	    blueviolet: 0x8a2be2,
	    brown: 0xa52a2a,
	    burlywood: 0xdeb887,
	    cadetblue: 0x5f9ea0,
	    chartreuse: 0x7fff00,
	    chocolate: 0xd2691e,
	    coral: 0xff7f50,
	    cornflowerblue: 0x6495ed,
	    cornsilk: 0xfff8dc,
	    crimson: 0xdc143c,
	    cyan: 0x00ffff,
	    darkblue: 0x00008b,
	    darkcyan: 0x008b8b,
	    darkgoldenrod: 0xb8860b,
	    darkgray: 0xa9a9a9,
	    darkgreen: 0x006400,
	    darkgrey: 0xa9a9a9,
	    darkkhaki: 0xbdb76b,
	    darkmagenta: 0x8b008b,
	    darkolivegreen: 0x556b2f,
	    darkorange: 0xff8c00,
	    darkorchid: 0x9932cc,
	    darkred: 0x8b0000,
	    darksalmon: 0xe9967a,
	    darkseagreen: 0x8fbc8f,
	    darkslateblue: 0x483d8b,
	    darkslategray: 0x2f4f4f,
	    darkslategrey: 0x2f4f4f,
	    darkturquoise: 0x00ced1,
	    darkviolet: 0x9400d3,
	    deeppink: 0xff1493,
	    deepskyblue: 0x00bfff,
	    dimgray: 0x696969,
	    dimgrey: 0x696969,
	    dodgerblue: 0x1e90ff,
	    firebrick: 0xb22222,
	    floralwhite: 0xfffaf0,
	    forestgreen: 0x228b22,
	    fuchsia: 0xff00ff,
	    gainsboro: 0xdcdcdc,
	    ghostwhite: 0xf8f8ff,
	    gold: 0xffd700,
	    goldenrod: 0xdaa520,
	    gray: 0x808080,
	    green: 0x008000,
	    greenyellow: 0xadff2f,
	    grey: 0x808080,
	    honeydew: 0xf0fff0,
	    hotpink: 0xff69b4,
	    indianred: 0xcd5c5c,
	    indigo: 0x4b0082,
	    ivory: 0xfffff0,
	    khaki: 0xf0e68c,
	    lavender: 0xe6e6fa,
	    lavenderblush: 0xfff0f5,
	    lawngreen: 0x7cfc00,
	    lemonchiffon: 0xfffacd,
	    lightblue: 0xadd8e6,
	    lightcoral: 0xf08080,
	    lightcyan: 0xe0ffff,
	    lightgoldenrodyellow: 0xfafad2,
	    lightgray: 0xd3d3d3,
	    lightgreen: 0x90ee90,
	    lightgrey: 0xd3d3d3,
	    lightpink: 0xffb6c1,
	    lightsalmon: 0xffa07a,
	    lightseagreen: 0x20b2aa,
	    lightskyblue: 0x87cefa,
	    lightslategray: 0x778899,
	    lightslategrey: 0x778899,
	    lightsteelblue: 0xb0c4de,
	    lightyellow: 0xffffe0,
	    lime: 0x00ff00,
	    limegreen: 0x32cd32,
	    linen: 0xfaf0e6,
	    magenta: 0xff00ff,
	    maroon: 0x800000,
	    mediumaquamarine: 0x66cdaa,
	    mediumblue: 0x0000cd,
	    mediumorchid: 0xba55d3,
	    mediumpurple: 0x9370db,
	    mediumseagreen: 0x3cb371,
	    mediumslateblue: 0x7b68ee,
	    mediumspringgreen: 0x00fa9a,
	    mediumturquoise: 0x48d1cc,
	    mediumvioletred: 0xc71585,
	    midnightblue: 0x191970,
	    mintcream: 0xf5fffa,
	    mistyrose: 0xffe4e1,
	    moccasin: 0xffe4b5,
	    navajowhite: 0xffdead,
	    navy: 0x000080,
	    oldlace: 0xfdf5e6,
	    olive: 0x808000,
	    olivedrab: 0x6b8e23,
	    orange: 0xffa500,
	    orangered: 0xff4500,
	    orchid: 0xda70d6,
	    palegoldenrod: 0xeee8aa,
	    palegreen: 0x98fb98,
	    paleturquoise: 0xafeeee,
	    palevioletred: 0xdb7093,
	    papayawhip: 0xffefd5,
	    peachpuff: 0xffdab9,
	    peru: 0xcd853f,
	    pink: 0xffc0cb,
	    plum: 0xdda0dd,
	    powderblue: 0xb0e0e6,
	    purple: 0x800080,
	    rebeccapurple: 0x663399,
	    red: 0xff0000,
	    rosybrown: 0xbc8f8f,
	    royalblue: 0x4169e1,
	    saddlebrown: 0x8b4513,
	    salmon: 0xfa8072,
	    sandybrown: 0xf4a460,
	    seagreen: 0x2e8b57,
	    seashell: 0xfff5ee,
	    sienna: 0xa0522d,
	    silver: 0xc0c0c0,
	    skyblue: 0x87ceeb,
	    slateblue: 0x6a5acd,
	    slategray: 0x708090,
	    slategrey: 0x708090,
	    snow: 0xfffafa,
	    springgreen: 0x00ff7f,
	    steelblue: 0x4682b4,
	    tan: 0xd2b48c,
	    teal: 0x008080,
	    thistle: 0xd8bfd8,
	    tomato: 0xff6347,
	    turquoise: 0x40e0d0,
	    violet: 0xee82ee,
	    wheat: 0xf5deb3,
	    white: 0xffffff,
	    whitesmoke: 0xf5f5f5,
	    yellow: 0xffff00,
	    yellowgreen: 0x9acd32
	  };

	  color.prototype = Color.prototype = {
	    displayable: function displayable() {
	      return this.rgb().displayable();
	    },
	    toString: function toString() {
	      return this.rgb() + "";
	    }
	  };

	  function color(format) {
	    var m;
	    format = (format + "").trim().toLowerCase();
	    return (m = reHex3.exec(format)) ? (m = parseInt(m[1], 16), new Rgb(m >> 8 & 0xf | m >> 4 & 0x0f0, m >> 4 & 0xf | m & 0xf0, (m & 0xf) << 4 | m & 0xf) // #f00
	    ) : (m = reHex6.exec(format)) ? rgbn(parseInt(m[1], 16)) // #ff0000
	    : (m = reRgbInteger.exec(format)) ? new Rgb(m[1], m[2], m[3]) // rgb(255,0,0)
	    : (m = reRgbPercent.exec(format)) ? new Rgb(m[1] * 255 / 100, m[2] * 255 / 100, m[3] * 255 / 100) // rgb(100%,0%,0%)
	    : (m = reHslPercent.exec(format)) ? new Hsl(m[1], m[2] / 100, m[3] / 100) // hsl(120,50%,50%)
	    : named.hasOwnProperty(format) ? rgbn(named[format]) : null;
	  }

	  function rgbn(n) {
	    return new Rgb(n >> 16 & 0xff, n >> 8 & 0xff, n & 0xff);
	  }

	  function rgb(r, g, b) {
	    if (arguments.length === 1) {
	      if (!(r instanceof Color)) r = color(r);
	      if (r) {
	        r = r.rgb();
	        b = r.b;
	        g = r.g;
	        r = r.r;
	      } else {
	        r = g = b = NaN;
	      }
	    }
	    return new Rgb(r, g, b);
	  }

	  function Rgb(r, g, b) {
	    this.r = +r;
	    this.g = +g;
	    this.b = +b;
	  }

	  var _rgb = rgb.prototype = Rgb.prototype = new Color();

	  _rgb.brighter = function (k) {
	    k = k == null ? brighter : Math.pow(brighter, k);
	    return new Rgb(this.r * k, this.g * k, this.b * k);
	  };

	  _rgb.darker = function (k) {
	    k = k == null ? darker : Math.pow(darker, k);
	    return new Rgb(this.r * k, this.g * k, this.b * k);
	  };

	  _rgb.rgb = function () {
	    return this;
	  };

	  _rgb.displayable = function () {
	    return 0 <= this.r && this.r <= 255 && 0 <= this.g && this.g <= 255 && 0 <= this.b && this.b <= 255;
	  };

	  _rgb.toString = function () {
	    var r = Math.round(this.r),
	        g = Math.round(this.g),
	        b = Math.round(this.b);
	    return "#" + (isNaN(r) || r <= 0 ? "00" : r < 16 ? "0" + r.toString(16) : r >= 255 ? "ff" : r.toString(16)) + (isNaN(g) || g <= 0 ? "00" : g < 16 ? "0" + g.toString(16) : g >= 255 ? "ff" : g.toString(16)) + (isNaN(b) || b <= 0 ? "00" : b < 16 ? "0" + b.toString(16) : b >= 255 ? "ff" : b.toString(16));
	  };

	  function hsl(h, s, l) {
	    if (arguments.length === 1) {
	      if (h instanceof Hsl) {
	        l = h.l;
	        s = h.s;
	        h = h.h;
	      } else {
	        if (!(h instanceof Color)) h = color(h);
	        if (h) {
	          if (h instanceof Hsl) return h;
	          h = h.rgb();
	          var r = h.r / 255,
	              g = h.g / 255,
	              b = h.b / 255,
	              min = Math.min(r, g, b),
	              max = Math.max(r, g, b),
	              range = max - min;
	          l = (max + min) / 2;
	          if (range) {
	            s = l < 0.5 ? range / (max + min) : range / (2 - max - min);
	            if (r === max) h = (g - b) / range + (g < b) * 6;else if (g === max) h = (b - r) / range + 2;else h = (r - g) / range + 4;
	            h *= 60;
	          } else {
	            h = NaN;
	            s = l > 0 && l < 1 ? 0 : h;
	          }
	        } else {
	          h = s = l = NaN;
	        }
	      }
	    }
	    return new Hsl(h, s, l);
	  }

	  function Hsl(h, s, l) {
	    this.h = +h;
	    this.s = +s;
	    this.l = +l;
	  }

	  var _hsl = hsl.prototype = Hsl.prototype = new Color();

	  _hsl.brighter = function (k) {
	    k = k == null ? brighter : Math.pow(brighter, k);
	    return new Hsl(this.h, this.s, this.l * k);
	  };

	  _hsl.darker = function (k) {
	    k = k == null ? darker : Math.pow(darker, k);
	    return new Hsl(this.h, this.s, this.l * k);
	  };

	  _hsl.rgb = function () {
	    var h = this.h % 360 + (this.h < 0) * 360,
	        s = isNaN(h) || isNaN(this.s) ? 0 : this.s,
	        l = this.l,
	        m2 = l + (l < 0.5 ? l : 1 - l) * s,
	        m1 = 2 * l - m2;
	    return new Rgb(hsl2rgb(h >= 240 ? h - 240 : h + 120, m1, m2), hsl2rgb(h, m1, m2), hsl2rgb(h < 120 ? h + 240 : h - 120, m1, m2));
	  };

	  _hsl.displayable = function () {
	    return (0 <= this.s && this.s <= 1 || isNaN(this.s)) && 0 <= this.l && this.l <= 1;
	  };

	  /* From FvD 13.37, CSS Color Module Level 3 */
	  function hsl2rgb(h, m1, m2) {
	    return (h < 60 ? m1 + (m2 - m1) * h / 60 : h < 180 ? m2 : h < 240 ? m1 + (m2 - m1) * (240 - h) / 60 : m1) * 255;
	  }

	  var deg2rad = Math.PI / 180;
	  var rad2deg = 180 / Math.PI;

	  var Kn = 18;
	  var Xn = 0.950470;
	  var Yn = 1;
	  var Zn = 1.088830;
	  var t0 = 4 / 29;
	  var t1 = 6 / 29;
	  var t2 = 3 * t1 * t1;
	  var t3 = t1 * t1 * t1;
	  function lab(l, a, b) {
	    if (arguments.length === 1) {
	      if (l instanceof Lab) {
	        b = l.b;
	        a = l.a;
	        l = l.l;
	      } else if (l instanceof Hcl) {
	        var h = l.h * deg2rad;
	        b = Math.sin(h) * l.c;
	        a = Math.cos(h) * l.c;
	        l = l.l;
	      } else {
	        if (!(l instanceof Rgb)) l = rgb(l);
	        b = rgb2xyz(l.r);
	        a = rgb2xyz(l.g);
	        l = rgb2xyz(l.b);
	        var x = xyz2lab((0.4124564 * b + 0.3575761 * a + 0.1804375 * l) / Xn),
	            y = xyz2lab((0.2126729 * b + 0.7151522 * a + 0.0721750 * l) / Yn),
	            z = xyz2lab((0.0193339 * b + 0.1191920 * a + 0.9503041 * l) / Zn);
	        b = 200 * (y - z);
	        a = 500 * (x - y);
	        l = 116 * y - 16;
	      }
	    }
	    return new Lab(l, a, b);
	  }

	  function Lab(l, a, b) {
	    this.l = +l;
	    this.a = +a;
	    this.b = +b;
	  }

	  var _lab = lab.prototype = Lab.prototype = new Color();

	  _lab.brighter = function (k) {
	    return new Lab(this.l + Kn * (k == null ? 1 : k), this.a, this.b);
	  };

	  _lab.darker = function (k) {
	    return new Lab(this.l - Kn * (k == null ? 1 : k), this.a, this.b);
	  };

	  _lab.rgb = function () {
	    var y = (this.l + 16) / 116,
	        x = isNaN(this.a) ? y : y + this.a / 500,
	        z = isNaN(this.b) ? y : y - this.b / 200;
	    y = Yn * lab2xyz(y);
	    x = Xn * lab2xyz(x);
	    z = Zn * lab2xyz(z);
	    return new Rgb(xyz2rgb(3.2404542 * x - 1.5371385 * y - 0.4985314 * z), // D65 -> sRGB
	    xyz2rgb(-0.9692660 * x + 1.8760108 * y + 0.0415560 * z), xyz2rgb(0.0556434 * x - 0.2040259 * y + 1.0572252 * z));
	  };

	  function xyz2lab(t) {
	    return t > t3 ? Math.pow(t, 1 / 3) : t / t2 + t0;
	  }

	  function lab2xyz(t) {
	    return t > t1 ? t * t * t : t2 * (t - t0);
	  }

	  function xyz2rgb(x) {
	    return 255 * (x <= 0.0031308 ? 12.92 * x : 1.055 * Math.pow(x, 1 / 2.4) - 0.055);
	  }

	  function rgb2xyz(x) {
	    return (x /= 255) <= 0.04045 ? x / 12.92 : Math.pow((x + 0.055) / 1.055, 2.4);
	  }

	  function hcl(h, c, l) {
	    if (arguments.length === 1) {
	      if (h instanceof Hcl) {
	        l = h.l;
	        c = h.c;
	        h = h.h;
	      } else {
	        if (!(h instanceof Lab)) h = lab(h);
	        l = h.l;
	        c = Math.sqrt(h.a * h.a + h.b * h.b);
	        h = Math.atan2(h.b, h.a) * rad2deg;
	        if (h < 0) h += 360;
	      }
	    }
	    return new Hcl(h, c, l);
	  }

	  function Hcl(h, c, l) {
	    this.h = +h;
	    this.c = +c;
	    this.l = +l;
	  }

	  var _hcl = hcl.prototype = Hcl.prototype = new Color();

	  _hcl.brighter = function (k) {
	    return new Hcl(this.h, this.c, this.l + Kn * (k == null ? 1 : k));
	  };

	  _hcl.darker = function (k) {
	    return new Hcl(this.h, this.c, this.l - Kn * (k == null ? 1 : k));
	  };

	  _hcl.rgb = function () {
	    return lab(this).rgb();
	  };

	  var A = -0.14861;
	  var B = +1.78277;
	  var C = -0.29227;
	  var D = -0.90649;
	  var E = +1.97294;
	  var ED = E * D;
	  var EB = E * B;
	  var BC_DA = B * C - D * A;
	  function cubehelix(h, s, l) {
	    if (arguments.length === 1) {
	      if (h instanceof Cubehelix) {
	        l = h.l;
	        s = h.s;
	        h = h.h;
	      } else {
	        if (!(h instanceof Rgb)) h = rgb(h);
	        var r = h.r / 255,
	            g = h.g / 255,
	            b = h.b / 255;
	        l = (BC_DA * b + ED * r - EB * g) / (BC_DA + ED - EB);
	        var bl = b - l,
	            k = (E * (g - l) - C * bl) / D;
	        s = Math.sqrt(k * k + bl * bl) / (E * l * (1 - l)); // NaN if l=0 or l=1
	        h = s ? Math.atan2(k, bl) * rad2deg - 120 : NaN;
	        if (h < 0) h += 360;
	      }
	    }
	    return new Cubehelix(h, s, l);
	  }

	  function Cubehelix(h, s, l) {
	    this.h = +h;
	    this.s = +s;
	    this.l = +l;
	  }

	  var _cubehelix = cubehelix.prototype = Cubehelix.prototype = new Color();

	  _cubehelix.brighter = function (k) {
	    k = k == null ? brighter : Math.pow(brighter, k);
	    return new Cubehelix(this.h, this.s, this.l * k);
	  };

	  _cubehelix.darker = function (k) {
	    k = k == null ? darker : Math.pow(darker, k);
	    return new Cubehelix(this.h, this.s, this.l * k);
	  };

	  _cubehelix.rgb = function () {
	    var h = isNaN(this.h) ? 0 : (this.h + 120) * deg2rad,
	        l = +this.l,
	        a = isNaN(this.s) ? 0 : this.s * l * (1 - l),
	        cosh = Math.cos(h),
	        sinh = Math.sin(h);
	    return new Rgb(255 * (l + a * (A * cosh + B * sinh)), 255 * (l + a * (C * cosh + D * sinh)), 255 * (l + a * (E * cosh)));
	  };

	  var version = "0.3.4";

	  exports.version = version;
	  exports.color = color;
	  exports.rgb = rgb;
	  exports.hsl = hsl;
	  exports.lab = lab;
	  exports.hcl = hcl;
	  exports.cubehelix = cubehelix;
	});

/***/ }
/******/ ]);