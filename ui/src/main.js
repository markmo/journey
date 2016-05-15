import 'd3';
import d3sankey from 'd3-sankey';

var _data;

d3.alluvial = () => {

  function layout() {

    function findTeamForward(team, week) {
      if (week + 1 > teamsByWeek.length - 1) return [];
      const teams = teamsByWeek[week + 1];
      let teamInWeek = teams.filter((x) => {
        return team.key == x.key;
      });
      if (teamInWeek.length < 1) { // not found
        teamInWeek = findTeamForward(team, week + 1);
        if (week + 1 == teamsByWeek.length - 1) {
          return [];
        }
      }
      return teamInWeek;
    }

    function findTeamBack(team, week) {
      if (team.week < 1) return [];
      const teams = teamsByWeek[week - 1];
      let teamInWeek = teams.filter((x) => {
        return team.key == x.key;
      });
      if (teamInWeek.length < 1) { // not found
        teamInWeek = findTeamBack(team, week - 1);
        if (teamInWeek.length < 1) {
          console.log(`Can't find team ${team.key} in week ${week - 1}`);
        }
      }
      return teamInWeek;
    }

    links = [];
    nodes = [];
    teamsByWeek = [];
    let gameIndex = 0;

    _data.forEach((game) => {
      game.week > teamsByWeek.length - 1 && (teamsByWeek.push([]), gameIndex = 0);
      var awayTeam = {
        key: game.away,
        value: game.away_prob,
        opponent: game.home,
        opponentValue: game.home_prob,
        gameKey: `${game.home}_${game.away}_w${game.week}`,
        week: game.week,
        game: game,
        gameIndex: gameIndex,
        type: 'away',
        win: game.away_prob >= .5 ? 1 : 0,
        totalWins: 0,
        sourceLinks: [],
        targetLinks: []
      }
      nodes.push(awayTeam);
      teamsByWeek[game.week].push(awayTeam);
      var homeTeam = {
        key: game.home,
        value: game.home_prob,
        opponent: game.away,
        opponentValue: game.away_prob,
        gameKey: `${game.home}_${game.away}_w${game.week}`,
        week: game.week,
        game: game,
        gameIndex: gameIndex,
        type: 'home',
        win: game.home_prob >= .5 ? 1 : 0,
        totalWins: 0,
        sourceLinks: [],
        targetLinks: []
      }
      nodes.push(homeTeam);
      teamsByWeek[game.week].push(homeTeam);
      gameIndex++;
    });

    padding = size[1] * j; // diagram height x fraction
    height = (size[1] - teamsByWeek[0].length * padding) / teamsByWeek[0].length;
    xOffset = (size[0] - width) / (teamsByWeek.length - 1);
    vOffset = height + padding;

    let i = 0;
    teamsByWeek.forEach((x) => {
      hOffsets.push(xOffset * i), i++;
    });

    nodes.forEach((node) => {
      node.sourceLinks = findTeamBack(node, node.week);
      node.targetLinks = findTeamForward(node, node.week);
      node.x = node.week * xOffset;
      node.dx = width;
      if (node.value >= .5) {
        node.y = (node.gameIndex - 1) * vOffset;
      } else {
        node.y = (node.gameIndex - 1) * vOffset + height * (1 - node.value) + 1;
      }
      node.dy = height * node.value;
    });

    nodes.forEach((source) => {
      if (source.week < teamsByWeek.length - 1) {
        var teamInWeek = findTeamForward(source, source.week);
        if (teamInWeek.length > 0) {
          let target = teamInWeek[0];
          target.totalWins = source.totalWins + target.win;
          links.push({
            source: source,
            target: target,
            sy: source.y,
            ty: target.y,
            sdy: source.dy,
            tdy: target.dy,
            dy: source.dy,
            key: source.key,
            value: target.value,
            wins: target.totalWins
          });
        }
      }
    });
  }

  let nodes, links, teamsByWeek, xOffset, vOffset, hOffsets = [],
    height = 50,
    width = 8,
    padding = 8,
    size = [1, 1],
    j = .01;

  let a = {};
  a.data = function (x) { return arguments.length ? (_data = x, a) : _data }
  a.nodeHeight = function (x) { return arguments.length ? a : height }
  a.nodeWidth = function (x) { return arguments.length ? (width = x, a) : width }
  a.nodePadding = function (x) { return arguments.length ? (padding = x, a) : padding }
  a.nodes = function (x) { return arguments.length ? (nodes = x, a) : nodes }
  a.links = function (x) { return arguments.length ? (links = x, a) : links }
  a.size = function (x) { return arguments.length ? (size = x, a) : size }
  a.hOffsets = () => hOffsets;
  a.xOffset = () => xOffset;
  a.layout = () => (layout(), a);
  a.relayout = () => a;
  a.link = () => {

    function path(link) {
      const sx = link.source.x + link.source.dx;
      const tx = link.target.x;
      const e = d3.interpolateNumber(sx, tx);
      const f = e(curvature);
      const g = e(1 - curvature);
      const sy = link.source.y;
      const ty = link.target.y;
      return `M ${sx},${sy} C ${f},${sy} ${g},${ty} ${tx},${ty} L ${tx},${ty + link.tdy} C ${f},${ty + link.tdy} ${f},${sy + link.sdy} ${sx},${sy + link.sdy} L ${sx},${sy}`;
    }

    let curvature = .5;
    path.curvature = function (x) {
      return arguments.length ? (curvature = x, path) : curvature;
    };

    return path;
  };

  return a;
};

const margin = {
  top: 0,
  right: 50,
  bottom: 10,
  left: 50
};
const windowWidth = window.innerWidth - 30;
const width = Math.max(windowWidth, 800) - margin.left - margin.right;
const height = 1440 - margin.top - margin.bottom;

d3.format(',.0f');
d3.scale.category20();

let svg = d3.select('#diagram').append('svg')
  .style('overflow', 'visible')
  .attr('width', width + margin.left + margin.right)
  .attr('height', height + margin.top + margin.bottom);

let header = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);
let body = svg.append('g').attr('transform', `translate(${margin.left},${margin.top + 100})`);

let alluvial = d3.alluvial().nodeWidth(8).nodePadding(10).size([width, height - 100]);
let link = alluvial.link();

let game = d3.select('#game');
let winner = (d3.select('#winner'), d3.select('#game_winner_name'));
let winnerImg = d3.select('#game_winner_img');
let winnerProb = d3.select('#game_winner_prob');
let loser = (d3.select('#loser'), d3.select('#game_loser_name'));
let loserImg = d3.select('#game_loser_img');
let loserProb = d3.select('#game_loser_prob');

d3.json('teams.json', (err, data) => {
  let r = [];
  let s = {};

  data.teams.forEach((team) => {
    s[team.key] = team;
  });

  d3.csv('nfl_games.csv', (games) => {

    function showPath(node) {
      d3.selectAll('path.' + node.key).transition().style('fill-opacity', .3);
      body.selectAll('rect').filter(function () {
        return this.__data__.key != node.key;
      }).transition().style('fill-opacity', .1);
      body.selectAll('rect').filter(function () {
        return this.__data__.opponent == node.key;
      }).transition().style('fill-opacity', .25);
      body.selectAll('text.' + node.key).data();
      body.selectAll('text').filter(function () {
        return this.__data__.key != node.key && this.__data__.opponent != node.key;
      }).transition().style('fill-opacity', .1);
      game.style('top', () => {
        let top = node.value > .49 ? node.y + margin.top + 140 : node.y + margin.top + 140 - (20 - node.dy);
        return top + 'px';
      }).style('left', () => Math.min(width - 130, Math.max(node.x - 37, 20)) + 'px');
      game.transition().style('opacity', 1);
      let b, c, e, f;
      if (node.value > .49) {
        b = s[node.key];
        c = s[node.opponent];
        e = node.value;
        f = node.opponentValue;
      } else {
        b = s[node.opponent];
        c = s[node.key];
        e = node.opponentValue;
        f = node.value;
      }
      winner.text(b.name).style('color', b.color);
      winnerProb.text(Math.round(100 * e) + '%').style('color', b.color);
      winnerImg.attr('src', 'assets/' + b.key + '.png');
      loser.text(c.name).style('color', c.color);
      loserProb.text(Math.round(100 * f) + '%').style('color', c.color);
      loserImg.attr('src', 'assets/' + c.key + '.png');
      header.selectAll('.weekLabel').transition().style('font-weight', (b, c) => {
        return c == node.week || c == node.week + 17 ? 'bold' : 'normal';
      }).style('font-size', (b, c) => {
        return c == node.week || c == node.week + 17 ? '16px' : '13px';
      });
    }

    function hidePath(node) {
      d3.selectAll('path').transition().style('fill-opacity', 0);
      body.selectAll('rect').transition().style('fill-opacity', (node) => {
        return node.value < .5 ? .4 : .8;
      });
      body.selectAll('text').transition().style('fill-opacity', 1);
      header.selectAll('.headerLabel').transition().style('opacity', 0);
      header.selectAll('.weekLabel').transition().style('font-weight', 'normal').style('font-size', '13px');
      game.transition().style('opacity', 0);
    }

    function color(key) {
      return s[key].color;
    }

    let gamesArray = [];
    games.forEach((game) => {
      gamesArray.push({
        week: Number(game.week),
        away: game.away,
        home: game.home,
        away_prob: Number(game.away_prob),
        home_prob: Number(game.home_prob)
      });
    });
    alluvial.data(gamesArray).layout();

    let topLabel = header.selectAll('.topLabel').data(alluvial.hOffsets()).enter();

    topLabel.append('text').style('fill', '#1976D2').style('font-weight', 400).style('font-size', '13px').style('text-anchor', 'middle').attr('class', 'weekLabel').attr('y', 15 - margin.top).attr('x', (a) => {
      return a;
    }).text('WEEK');

    topLabel.append('text').style('fill', '#1976D2').style('font-weight', 400).style('font-size', '13px').style('text-anchor', 'middle').attr('class', 'weekLabel').attr('y', 35 - margin.top).attr('x', (a) => {
      return a;
    }).text((a, b) => {
      return b + 1
    });

    body.append('g').selectAll('.link').data(alluvial.links()).enter().append('path').attr('class', (x) => {
      return `link ${x.key}`;
    }).attr('d', link).style('fill', (x) => {
      return color(x.key);
    }).style('fill-opacity', 0).style('stroke', (x) => {
      return color(x.key);
    }).style('stroke-width', .5).style('stroke-opacity', 0);

    var D = body.append('g').selectAll('.node').data(alluvial.nodes()).enter().append('g').attr('class', 'node').attr('transform', (a) => {
      return `translate(${a.x},${a.y})`;
    });

    D.append('rect').attr('class', (x) => {
      return `game ${x.key} ${x.gameKey}`;
    }).attr('height', (x) => {
      return x.dy;
    }).attr('width', alluvial.nodeWidth()).style('fill', (x) => {
      return color(x.key);
    }).style('fill-opacity', (x) => {
      return x.value < .5 ? .4 : .8;
    }).style('stroke', (x) => {
      return color(x.key);
    }).style('stroke-opacity', 0).on('mouseover', (x) => {
      showPath(x);
    }).on('mouseout', (x) => {
      hidePath(x);
    });

    D.append('text').attr('x', -6).attr('class', (x) => {
      return `game ${x.gameKey} ${x.key}`;
    }).attr('y', (x) => {
      return x.dy / 2;
    }).attr('dy', '.35em').style('font-weight', (x) => {
      return x.value < .5 ? 200 : 700;
    }).style('fill-opacity', 1).attr('text-anchor', 'end').style('font-size', '11px').style('fill', (x) => {
      return color(x.key);
    }).attr('transform', null).text((x) => {
      return x.key;
    }).on('mouseover', (x) => {
      showPath(x);
    }).on('mouseout', (a) => {
      hidePath(x);
    });
  });
});


// var sankey = d3sankey.sankey()
//   .nodeWidth(15)
//   .nodePadding(10)
//   .size([width, height]);
//
// var path = sankey.link();
//
// d3.json('data.json', (data) => {
//   sankey
//     .nodes(data.nodes)
//     .links(data.links)
//     .layout(32);
//
//   var link = svg.append('g').selectAll('.link')
//     .data(data.links)
//     .enter().append('path')
//     .attr('class', 'link')
//     .attr('d', path)
//     .style('stroke-width', (d) => {
//       return Math.max(1, d.dy);
//     })
//     .sort((a, b) => {
//       return b.dy - a.dy;
//     });
//
//   var node = svg.append('g').selectAll('.node')
//     .data(data.nodes)
//     .enter().append('g')
//     .attr('class', 'node')
//     .attr('transform', (d) => {
//       return 'translate(' + d.x + ',' + d.y + ')';
//     });
//
//   node.append('rect')
//     .attr('height', (d) => {
//       return d.dy;
//     })
//     .attr('width', sankey.nodeWidth())
//     .style('fill', (d) => {
//       return d.color = d3.color(d.name.replace(/ .*/, ''));
//     })
//     .style('stroke', (d) => {
//       return d3.rgb(d.color).darker(2);
//     })
//     .append('title')
//     .text((d) => {
//       return d.name + '\n' + d3.format(d.value);
//     });
//
//   node.append('text')
//     .attr('x', -6)
//     .attr('y', (d) => {
//       return d.dy / 2;
//     })
//     .attr('dy', '.35em')
//     .attr('text-anchor', 'end')
//     .attr('transform', null)
//     .text((d) => {
//       return d.name;
//     })
//     .filter((d) => {
//       return d.x < width / 2;
//     })
//     .attr('x', 6 + sankey.nodeWidth())
//     .attr('text-anchor', 'start');
// });
