// ==UserScript==
// @name         Address List BGP Plus
// @namespace    https://github.com/AdroitAdorKhan/addrlistbgpPlus
// @updateURL    https://raw.githubusercontent.com/AdroitAdorKhan/addrlistbgpPlus/main/addrlistbgp.user.js
// @downloadURL  https://raw.githubusercontent.com/AdroitAdorKhan/addrlistbgpPlus/main/addrlistbgp.user.js
// @version      1.1
// @description  Get Address List from BGP and more.
// @author       Ador
// @match        https://bgp.he.net/search*
// @match        https://bgp.he.net/AS*
// @grant        none
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// ==/UserScript==

(function() {
    'use strict';

    // Initial setup: add styles and HTML elements to the page
    $("#content").prepend(`
        <style>
            .btnx {
                border: 1px solid #000066;
                height: 22px;
                margin-right: 8px;
                margin-bottom: 8px;
                padding-left: 3px;
                padding-right: 3px;
                cursor: pointer;
            }
            .tabresult {
                border: 1px solid #000066;
                padding: 15px;
                min-width: 742px;
                width: 742px;
                margin-bottom: 8px;
            }
            #tblresult { border: none; width: 100%; }
        </style>

        <div id='result' style='display:none' class='tabresult'>
            <label for="listname">List Name:</label>
            <input type="text" id="listname" name="listname" value="">
            <select id="listnameDropdown" name="listnameDropdown">
                <option value="">Select a List Name</option>
                <option value="PPPoE-1">PPPoE-1</option>
                <option value="PPPoE-2">PPPoE-2</option>
                <option value="PPPoE-3">PPPoE-3</option>
                <option value="RESTRICTED">RESTRICTED</option>
                <option value="CLOUDFLARE">CLOUDFLARE</option>
                <option value="BLOCK">BLOCK</option>
            </select>
            <button class='btnx' id='refreshListName'>Update List Name</button>
            <button class='btnx' id='cpscript'>Copy Script</button>
            <button class='btnx' id='close'>Close</button>
            <table id='tblresult'></table>
        </div>
    `);

    let listname = '';

    // Event listener for the dropdown list
    $("#listnameDropdown").change(function() {
        listname = $(this).val(); // Update listname variable with selected value
        $("#listname").val(listname); // Also update the input field to match the dropdown
        updateTableContent(); // Update table content immediately when dropdown value changes
    });

    // Event listener for the input field
    $("#listname").on('input', function() {
        listname = $(this).val(); // Update listname variable with input field value
        updateTableContent(); // Update table content immediately when input field value changes
    });

    // Event listener for the Refresh List Name button
    $("#refreshListName").click(function() {
        listname = $("#listname").val();
        updateTableContent(); // Update table content immediately when the listname is refreshed
    });

    // Append a link to trigger script generation
    $("#header_search").append("<a href='#' id='getscript' style='color:#000066;'>Get Address List Script</a>");

    // Event listener for the Get Address List Script link
    $("#getscript").click(function() {
        updateTableContent();
        $("#result").show(); // Ensure the result div is visible
    });

    // Event listener for the Copy Script button
    $("#cpscript").click(function() {
        if (listname.trim() === '') {
            alert("Please enter a list name. List Name can't be empty!");
            return;
        }
        copyTable(document.getElementById("tblresult"));
    });

    // Event listener for the Close button
    $("#close").click(function() {
        $("#result").hide();
        $("#tblresult").html("");
    });

    // Function to update the content of the table based on the current listname
    function updateTableContent() {
        $("#tblresult").html(""); // Clear previous content
        $("#tblresult").append("<tr><td>/ip firewall address-list</td></tr>");

        var tr = $('table tr').filter(function() {
            return $(this).find("td");
        });

        tr.each(function() {
            var comment = "";
            var ip = $(this).find('a').html();
            if (location.href.split("/")[3].substr(0, 2) == "AS") {
                comment = $('#header').find('a')[1].innerHTML;
            } else {
                comment = $('#header').find('h1')[0].innerHTML.split('"')[1].split('"')[0];
            }
            if (ip && ip.split(".").length == 4) {
                $("#tblresult").append(`<tr><td>add address=` + ip + ` list="` + listname + `" comment="` + comment + `"</td></tr>`);
            }
        });

        $("#tblresult").append("<tr><td></td></tr>");
    }

    // Function to copy the content of the table to the clipboard
    function copyTable(el) {
        var body = document.body, range, sel;
        if (document.createRange && window.getSelection) {
            range = document.createRange();
            sel = window.getSelection();
            sel.removeAllRanges();
            try {
                range.selectNodeContents(el);
                sel.addRange(range);
            } catch (e) {
                range.selectNode(el);
                sel.addRange(range);
            }
        } else if (body.createTextRange) {
            range = body.createTextRange();
            range.moveToElementText(el);
            range.select();
        }
        document.execCommand("copy");
    }

})();
