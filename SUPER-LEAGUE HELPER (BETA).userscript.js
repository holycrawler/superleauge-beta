// ==UserScript==
// @name         SUPER-LEAGUE HELPER (BETA)
// @version      2024-02-01
// @description  helps gather stats for superleague
// @author       mini18
// @update       
// @match        https://www.dugout-online.com/forum/viewtopic/t/484171*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=dugout-online.com
// @grant        none
// ==/UserScript==

(function () {
  "use strict";
  const parseHtml = (text) => {
    const htmlParser = new DOMParser();
    return htmlParser.parseFromString(text, "text/html");
  };

  const participants = [
    "https://www.dugout-online.com/clubinfo/none/clubid/103237",
    "https://www.dugout-online.com/clubinfo/none/clubid/1666",
    "https://www.dugout-online.com/clubinfo/none/clubid/107067",
    "https://www.dugout-online.com/clubinfo/none/clubid/27330",
    "https://www.dugout-online.com/clubinfo/none/clubid/6544",
    "https://www.dugout-online.com/clubinfo/none/clubid/4042",
    "https://www.dugout-online.com/clubinfo/none/clubid/43664",
    "https://www.dugout-online.com/clubinfo/none/clubid/100327",
    "https://www.dugout-online.com/clubinfo/none/clubid/106327",
    "https://www.dugout-online.com/clubinfo/none/clubid/108366",
    "https://www.dugout-online.com/clubinfo/none/clubid/84948",
    "https://www.dugout-online.com/clubinfo/none/clubid/42868",
    "https://www.dugout-online.com/clubinfo/none/clubid/2459",
    "https://www.dugout-online.com/clubinfo/none/clubid/103905",
    "https://www.dugout-online.com/clubinfo/none/clubid/49191",
    "https://www.dugout-online.com/clubinfo/none/clubid/43830",
    "https://www.dugout-online.com/clubinfo/none/clubid/96360",
    "https://www.dugout-online.com/clubinfo/none/clubid/106046",
  ];

  const getLeagues = async () => {
    const results = [];
    const allfetches = new Array();
    for (let i = 0; i < participants.length; i++) {
      const e = participants[i];
      allfetches.push(
        fetch(e)
          .then((response) => response.text())
          .then((text) => {
            const doc = parseHtml(text);
            results.push({
              leagueURL: doc.querySelector(
                'a[href*="https://www.dugout-online.com/competitions/selectedCountryABB"]'
              ).href,
              teamName: doc.querySelector("div.clubname").textContent.trim(),
            });
          })
      );
    }
    return Promise.all(allfetches).then(() => {
      return results;
    });
  };

  const getParticipantsStats = async () => {
    const leagueURLS = await getLeagues();
    const parcedTable = [];
    const allfetches = new Array();
    for (let index = 0; index < leagueURLS.length; index++) {
      const e = leagueURLS[index];
      allfetches.push(
        fetch(e.leagueURL)
          .then((response) => response.text())
          .then((text) => {
            const doc = parseHtml(text);
            const leagueTable = doc.querySelector("table#myTable");
            for (i = 1; i < leagueTable.rows.length; i++) {
              const row = leagueTable.rows[i];
              if (row.cells[1].textContent.trim() != e.teamName) continue;
              parcedTable.push({
                POS: row.cells[0].textContent.trim(),
                TEAM: row.cells[1].textContent.trim(),
                PL: row.cells[3].textContent.trim(),
                W: row.cells[4].textContent.trim(),
                D: row.cells[5].textContent.trim(),
                L: row.cells[6].textContent.trim(),
                F: row.cells[7].textContent.trim(),
                A: row.cells[8].textContent.trim(),
                PTS: row.cells[9].textContent.trim(),
              });
            }
          })
      );
    }
    return Promise.all(allfetches).then(() => {
      return parcedTable;
    });
  };

  const copyTable = async () => {
    const parcedStats = await getParticipantsStats();
    let output = "POS\tTEAM\tPL\tW\tD\tL\tF\tA\tPTS";
    parcedStats.forEach((e) => {
      output += `\n${e.POS}\t${e.TEAM}\t${e.PL}\t${e.W}\t${e.D}\t${e.L}\t${e.F}\t${e.A}\t${e.PTS}`;
    });
    navigator.clipboard.writeText(output);
    newDiv.append("TEXT COPIED !");
  };
  const newDiv = document.createElement("div");
  newDiv.style = "position: fixed; bottom: 10px; left: 10px;font-weight: bold;";
  const buttonHTML = `<input type="button" value="Copy Stats" id="copyText">`;
  newDiv.innerHTML = buttonHTML;
  document.querySelector("body").append(newDiv);
  document.querySelector("#copyText").addEventListener("click", copyTable);

  // Your code here...
})();
