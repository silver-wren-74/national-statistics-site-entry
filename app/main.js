// Indonesia in Numbers — page rendering. Reads window.INDONESIA_DATA (data.js)
// and draws every chart and table on the page. No network, no framework.
(function () {
  'use strict';

  var D = window.INDONESIA_DATA;
  var C = window.StatCharts;

  function byId(id) { return document.getElementById(id); }

  function mount(id, node) {
    var host = byId(id);
    if (host && node) host.appendChild(node);
  }

  function tableRows(rows, columns) {
    var html = '';
    rows.forEach(function (row) {
      html += '<tr>';
      columns.forEach(function (col) {
        html += '<td>' + row[col] + '</td>';
      });
      html += '</tr>';
    });
    return html;
  }

  function fillTable(id, rows, columns) {
    var body = byId(id);
    if (body) body.innerHTML = tableRows(rows, columns);
  }

  var page = document.body ? document.body.getAttribute('data-page') : null;

  if (page === 'overview') {
    mount('chart-population', C.barChart(
      D.populationHistory.map(function (p) { return { label: String(p.year), value: p.population }; }),
      { label: 'Population of Indonesia, 2020–2024, millions', valueLabel: function (v) { return v.toFixed(1); } }
    ));
    mount('chart-gdp', C.barChart(
      D.gdpHistory.map(function (g) { return { label: String(g.year), value: g.gdp }; }),
      { label: 'GDP of Indonesia, 2020–2024, trillion US dollars', valueLabel: function (v) { return '$' + v.toFixed(2) + 'T'; } }
    ));
    fillTable('ranks-body', D.worldRanks, ['measure', 'value', 'rank', 'year', 'source']);
  }

  if (page === 'demographics') {
    mount('chart-population', C.barChart(
      D.populationHistory.map(function (p) { return { label: String(p.year), value: p.population }; }),
      { label: 'Population of Indonesia, 2020–2024, millions', valueLabel: function (v) { return v.toFixed(1); } }
    ));
    var donutHost = byId('chart-age');
    if (donutHost) {
      donutHost.appendChild(C.donutChart(
        D.ageStructure.map(function (a) { return { label: a.group, value: a.share }; }),
        { label: 'Age structure of Indonesia, 2024', centre: '283.5M', centreSub: 'people, 2024' }
      ));
      donutHost.appendChild(C.legend(D.ageStructure, 100));
    }
    fillTable('provinces-body', D.provinces.map(function (p) {
      return { name: p.name, pop: p.population.toFixed(1) + ' million' };
    }), ['name', 'pop']);
  }

  if (page === 'economy') {
    mount('chart-gdp', C.barChart(
      D.gdpHistory.map(function (g) { return { label: String(g.year), value: g.gdp }; }),
      { label: 'GDP of Indonesia, 2020–2024, trillion US dollars', valueLabel: function (v) { return '$' + v.toFixed(2) + 'T'; } }
    ));
    mount('chart-growth', C.barChart(
      D.gdpHistory.map(function (g) { return { label: String(g.year), value: g.growth, color: g.growth < 0 ? '#b91c1c' : '#0f766e' }; }),
      { label: 'Real GDP growth of Indonesia, 2020–2024, percent', valueLabel: function (v) { return v.toFixed(2) + '%'; } }
    ));
    var sectorHost = byId('chart-sectors');
    if (sectorHost) {
      sectorHost.appendChild(C.donutChart(
        D.gdpSectors.map(function (s) { return { label: s.sector, value: s.share }; }),
        { label: 'GDP by sector, Indonesia 2024', centre: '100%', centreSub: 'of GDP, 2024' }
      ));
      sectorHost.appendChild(C.legend(D.gdpSectors, 100));
    }
    fillTable('macro-body', D.macro, ['indicator', 'value', 'year', 'source']);
  }

  if (page === 'health') {
    fillTable('health-body', D.health, ['indicator', 'value', 'year', 'source']);
    mount('chart-life', C.barChart(
      [
        { label: 'Indonesia', value: 71.3 },
        { label: 'World', value: 73.3 },
        { label: 'East Asia & Pacific', value: 76.9 },
        { label: 'Southeast Asia', value: 71.9 },
      ],
      { label: 'Life expectancy at birth, years, 2023', valueLabel: function (v) { return v.toFixed(1); } }
    ));
    mount('chart-mortality', C.barChart(
      D.mortalityComparison,
      { label: 'Child mortality, deaths per 1,000 live births, 2023', valueLabel: function (v) { return v.toFixed(0); } }
    ));
  }

  if (page === 'education') {
    fillTable('education-body', D.education, ['indicator', 'value', 'year', 'source']);
    mount('chart-schooling', C.barChart(
      [
        { label: 'Mean years', value: 9.2 },
        { label: 'Expected years', value: 13.9 },
      ],
      { label: 'Years of schooling in Indonesia', valueLabel: function (v) { return v.toFixed(1); } }
    ));
  }

  if (page === 'trade') {
    mount('chart-exports', C.hbarChart(
      D.trade.topExports.map(function (e) { return { label: e.product, value: e.value }; }),
      { label: 'Top exports of Indonesia, 2024, billion US dollars', valueLabel: function (v) { return '$' + v.toFixed(1) + 'B'; } }
    ));
    mount('chart-partners', C.hbarChart(
      D.trade.topPartners.map(function (p) { return { label: p.country, value: p.value }; }),
      { label: 'Top export partners of Indonesia, 2024, billion US dollars', valueLabel: function (v) { return '$' + v.toFixed(1) + 'B'; } }
    ));
    mount('chart-balance', C.barChart(
      D.trade.balanceHistory.map(function (b) { return { label: String(b.year), value: b.exports }; }),
      { label: 'Exports of goods, Indonesia 2020–2024, billion US dollars', valueLabel: function (v) { return '$' + v.toFixed(1) + 'B'; } }
    ));
    fillTable('exports-body', D.trade.topExports.map(function (e) {
      return { product: e.product, value: '$' + e.value.toFixed(1) + 'B', share: e.share.toFixed(1) + '%' };
    }), ['product', 'value', 'share']);
    fillTable('partners-body', D.trade.topPartners.map(function (p) {
      return { country: p.country, value: '$' + p.value.toFixed(1) + 'B', share: p.share.toFixed(1) + '%' };
    }), ['country', 'value', 'share']);
    fillTable('imports-body', D.trade.topImports.map(function (i) {
      return { product: i.product, value: '$' + i.value.toFixed(1) + 'B', share: i.share.toFixed(1) + '%' };
    }), ['product', 'value', 'share']);
  }

  // Sources footer: same list on every page, built from data.js.
  var srcList = byId('sources-list');
  if (srcList) {
    D.sources.forEach(function (s) {
      var li = document.createElement('li');
      li.textContent = s;
      srcList.appendChild(li);
    });
  }

  // Footer year stamp.
  var stamp = byId('data-stamp');
  if (stamp) stamp.textContent = 'Figures are for 2020–2024, the latest published year for each indicator. Page generated from local data files only — no network request.';
})();
