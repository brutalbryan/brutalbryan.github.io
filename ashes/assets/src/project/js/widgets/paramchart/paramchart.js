var paramChart = function () {
    var rowsPerPage,
        currentPage,
        allColumnHeaders,
        allRowData,
        visibleRowData,
        branchData,
        visibleBranchIndex,
        dataLoaded,
        chartLoadTicks,
        dropdownHTML;
    var cachedChartData = [];

    function initVariable() {
       rowsPerPage = 10;       // Rows per page of chart
       currentPage = 0;        // Current page of chart

       allColumnHeaders = [];  // Array of all table column headers
       allRowData = [];        // Array of each row of table data
       visibleRowData = [];    // Array of visible table row's data
       dropdownHTML = '';
       branchData = parametricBranchData;        // Array of data for all branch options (internally used)
       visibleBranchIndex = 0;     // Index (from branchData) of currently visible branch

       dataLoaded = false;     // Whether or not JSON data has finished loading
       chartLoadTicks = 0;     // Amount of times the chart checked if data was loaded

    }
    function writeParametricChartHTML() {        

        if (branchData.length > 1) {
            $('.parametric').append("<div class='parametric__header'><div class='parametric__title'><span class='parametric__title-text'><span class='parametric__title-text-name'></span><i class='fa fa-chevron-down parametric__title-arrow' aria-hidden='true'></i></span><ul class='parametric__title-options'></ul></div><a href='#' target='_blank' class='parametric__view-all-btn'>View All Parametrics</a></div><div class='parametric__options'><div class='parametric__search'><div class='parametric__search-box'><span class='parametric__search-icon'><i class='fa fa-search' aria-hidden='true'></i></span><input type='text' class='parametric__search-input' onkeyup='paramChart.searchTable(event);' placeholder='Search term' required='required' /><span class='clear-input' onclick='paramChart.clearSearch();'>&times;</span></div></div><input type='checkbox' id='parametricColumnsBox' class='parametric__columns-toggle-box' /><label for='parametricColumnsBox' class='parametric__columns-toggle'>Show/Hide Columns</label><ul class='parametric__columns-list'><li class='columns-list__top'><span class='columns-list__reset'>Reset Columns</span><span class='columns-list__close'>&times;</span></li></ul></div><div class='parametric__chart'><div class='parametric-table' data-sortby='0' data-sortorder='0' data-page='0'><div class='table__scrollable-area'><div class='table__row--header'></div></div></div><div class='parametric__pagination'><div class='parametric__pagination-pages'></div><div class='parametric__pagination-total'><span id='currentPageItemNumbers'></span> of <span id='totalTableItems'></span> items</div></div></div>");

            /*
                Sets dropdown options for different parametric chart branches and starts
                initial loading of chart
            */
            $.each(branchData, function (index, object) {
                dropdownHTML = dropdownHTML + "<li class='" + (index === 0 ? 'active' : '') + "' data-branchid=" + object['branchID'] + ">" + object['branchName'] + "</li>";
            });

            $(".parametric__title-options").html(dropdownHTML);

            $(".parametric__title-text-name").text(branchData[visibleBranchIndex]["branchName"]);

        } else {
            $('.parametric').append("<div class='parametric__header'><div class='parametric__title' style='cursor:default'><span class='parametric__title-text'><span class='parametric__title-text-name'></span></span><ul class='parametric__title-options'></ul></div><a href='#' target='_blank' class='parametric__view-all-btn'>View All Parametrics</a></div><div class='parametric__options'><div class='parametric__search'><div class='parametric__search-box'><span class='parametric__search-icon'><i class='fa fa-search' aria-hidden='true'></i></span><input type='text' class='parametric__search-input' onkeyup='paramChart.searchTable(event);' placeholder='Search term' required='required' /><span class='clear-input' onclick='paramChart.clearSearch();'>&times;</span></div></div><input type='checkbox' id='parametricColumnsBox' class='parametric__columns-toggle-box' /><label for='parametricColumnsBox' class='parametric__columns-toggle'>Show/Hide Columns</label><ul class='parametric__columns-list'><li class='columns-list__top'><span class='columns-list__reset'>Reset Columns</span><span class='columns-list__close'>&times;</span></li></ul></div><div class='parametric__chart'><div class='parametric-table' data-sortby='0' data-sortorder='0' data-page='0'><div class='table__scrollable-area'><div class='table__row--header'></div></div></div><div class='parametric__pagination'><div class='parametric__pagination-pages'></div><div class='parametric__pagination-total'><span id='currentPageItemNumbers'></span> of <span id='totalTableItems'></span> items</div></div></div>");
            $(".parametric__title-text-name").text(branchData[visibleBranchIndex]["branchName"]);
        }
    }


    /*
     * Loads JSON data for chart
     * @param branchID [integer]
          - ID of branch for which to pull JSON data
     */
    function getJSONDataAndRender(branchID, onDataLoaded) {

        var JSONData = [];

        // Set dataLoaded to false, as new data is starting to load
        dataLoaded = false;

        // Empty arrays containing data from JSON file
        allRowData.length = 0;
        visibleRowData.length = 0;
        allColumnHeaders.length = 0;

        if (chartDataIsCached(branchID)) {
            JSONData.push(getCachedChartData(branchID));
            if (onDataLoaded)
                onDataLoaded();
            onChartDataLoaded(JSONData)
        } else {
            var connectionURL = '//www.microchip.com/ParamChartSearch/chart.aspx?branchID=';
            var connectionString = connectionURL + branchID + (branchData[visibleBranchIndex]["automotive"] ? '&automotive=1' : '') + (branchData[visibleBranchIndex]["popular"] ? '&popular=1' : '') + '&data=json';

            $.getJSON(connectionString, function (data) {
                JSONData.push(data);
                cachedChartData.push({ branchId: branchID, data: data})
            }).done(function () {
                if (onDataLoaded)
                    onDataLoaded();
                onChartDataLoaded(JSONData);            
            });
        }
    }

    function chartDataIsCached(branchId) {
        var ret = false;
        if (typeof cachedChartData !== 'undefined' && cachedChartData.length > 0) {
            $.each(cachedChartData, function (idx, val) {
                if (val.branchId == branchId) ret = true;
            });
        }

        return ret;
    }

    function getCachedChartData(branchId) {
        var ret = null;
        $.each(cachedChartData, function (idx, val) {
            if (val.branchId == branchId) ret = val.data;
        });
        return ret;
    }

    function onChartDataLoaded(JSONData) {
        // Build paginatedData array using all JSONData
        $.each(JSONData[0], function (index, value) {

            $.each(value, function (key, value) {
                if (!allRowData[index]) allRowData[index] = [];
                allRowData[index].push(value);

                if (!visibleRowData[index]) visibleRowData[index] = [];
                visibleRowData[index].push(value);
            });

        });

        $.each(JSONData[0][0], function (key, value) {
            var keyWithoutUnderscores = key.replace(/_/g, " ");
            allColumnHeaders.push(keyWithoutUnderscores);
        });
        dataLoaded = true;
    }

    /*
     * Attempts to load chart every 250ms, will load when allColumnHeaders
     * and allRowData are populated
     */
    function loadChart() {

        // Hide parametric chart and show loading message
        if (!$(".parametric__message").length) {
            $(".parametric .parametric__chart").hide();
            $(".parametric")
                .append("<div class='parametric__message'>Loading</div>");
        } else {
            if (chartLoadTicks % 2 === 0)
                $(".parametric .parametric__message").append(" .");

            if (chartLoadTicks % 8 === 0)
                $(".parametric .parametric__message").text("Loading");
        }

        chartLoadTicks += 1;

        setTimeout(function () {

            // Check if JSON data is done loading
            if (dataLoaded) {

                chartLoadTicks = 0;

                // Remove loading message and show parametric chart
                if ($(".parametric__message").length) {
                    $(".parametric .parametric__message").remove();
                    $(".parametric .parametric__chart").show();
                }

                // Build table with buildTable's 'newData' parameter set to true
                buildTable(true);

            } else {

                // Recursively call loadChart
                loadChart();

            }

        }, 250);

    }


    /*
     * Builds table rows from JSON data
     * @param newData [optional, true/false, default false]
          - whether or not the table is being built with new data
     *
     */
    function buildTable(newData) {

        newData = newData || false; // If newData isn't specified, default to false

        if (newData) {

            // Set link for View All Parametrics link
            $(".parametric__view-all-btn").attr("href", "//www.microchip.com/ParamChartSearch/chart.aspx?branchID=" + branchData[visibleBranchIndex]["branchID"] + (branchData[visibleBranchIndex]["automotive"] ? '&automotive=1' : '') + (branchData[visibleBranchIndex]["popular"] ? '&popular=1' : ''));

            // Empty chart headers and list of columns
            $(".parametric .table__row--header").empty();
            $(".parametric .parametric__columns-list").contents(":not(.columns-list__top)").remove();

            // Loop through allColumnHeaders, add each to .parametric__columns-list with
            // corresponding checkboxes and default columns automatically checked
            for (var i = 0; i < allColumnHeaders.length; i++) {
                $(".parametric .table__row--header")
                    .append("<div class='table__cell'>" + allColumnHeaders[i] + "</div>");
                if (i === 0) continue; // don't include first column "Product" in dropdown
                $(".parametric")
                    .find(".parametric__columns-list")
                    .append("<li><input type='checkbox' class='table__header-checkbox' id='tableHeader" + i + "' " + (branchData[visibleBranchIndex]['defaultColumns'].indexOf(i) > -1 ? "checked" : "") + "><label for='tableHeader" + i + "'>" + allColumnHeaders[i] + "</label></li>"); // + (i < 5 ? "checked" : "") +
            }

            // Load default sorting parameters
            var parametricChart = $(".parametric .parametric-table");
            var defaultSortBy = branchData[visibleBranchIndex]["sortBy"] || 0;
            var defaultSortOrder = branchData[visibleBranchIndex]["sortOrder"] || 0;
            parametricChart.attr("data-sortby", defaultSortBy);
            parametricChart.attr("data-sortorder", defaultSortOrder);

            // Sort chart data
            sortData();

        }

        // Remove all table rows from table
        $(".parametric .table__row").remove();

        // Append rows on current page to table
        $.each(visibleRowData, function (index, data) { // index, data array

            // Check if current row index is within the current page, return if not
            if (index < (currentPage * rowsPerPage)) return;
            if (index >= ((currentPage * rowsPerPage) + rowsPerPage)) return false;

            // HTML for the entire row
            var rowHTML = "<div class='table__row'>";

            // Loop through row data and add individual cells to row
            $.each(data, function (index, value) {

                var cell = "<div class='table__cell'>";
                if (index === 0) {
                    cell = cell + "<a href='/wwwproducts/" + value + "'>" + value + "</a>";
                } else {
                    cell = cell + value;
                }
                cell = cell + "</div>";

                // Add cell to row HTML
                rowHTML = rowHTML + cell;

            });

            // Append rowHTML to table
            $(".table__scrollable-area").append(rowHTML);

        });

        // Only display columns that are checked in the columns list
        $(".parametric").find(".parametric__columns-list input[type=checkbox]:checked")
            .each(function (index) {
                var headerNumber = $(this).attr("id").split("tableHeader")[1];
                $(".parametric").find("[class*='table__row']").each(function () {
                    $(this)
                        .find(".table__cell")[headerNumber].style.display = "inline-block";
                });
            });

        buildPagination();
        resizeColumns();
        restripeRows();

    }


    /*
     * Builds pagination below table for navigating through table pages
     */
    function buildPagination() {

        // Update total item count
        $("#totalTableItems").text(visibleRowData.length);

        // Update item number range
        var lastOnPage = (currentPage * rowsPerPage) + 10;
        if (lastOnPage > visibleRowData.length) lastOnPage = visibleRowData.length;
        $("#currentPageItemNumbers")
            .text(((currentPage * rowsPerPage) + 1) + "-" + lastOnPage);

        // Update HTML of pagination pages element
        $(".parametric__pagination-pages").html(function () {

            // Start allPageButtons with first page and previous page buttons
            var allPageButtons = "<span class='parametric__pagination-page-button' data-page='first'><<</span><span class='parametric__pagination-page-button' data-page='prev'><</span>";

            // Determine lowest page in list of immediate 5
            var lowPage = function () {
                var page = currentPage - 1;
                if (page <= 0) page = 1;
                return page;
            }

            // Determine highest page in list of immediate 5
            var highPage = function () {
                var page = lowPage() + 5;
                if (page > Math.ceil(visibleRowData.length / rowsPerPage))
                    page = Math.ceil(visibleRowData.length / rowsPerPage) + 1;
                return page;
            }

            // Create page buttons for each page between the low and high pages
            for (var i = lowPage(); i < highPage(); i++) {
                allPageButtons = allPageButtons + "<span class='parametric__pagination-page-button " + ((i - 1) === currentPage ? "current-page" : "") + "' data-page='" + (i - 1) + "'>" + i + "</span>";
            }

            // Add next page and last page buttons to the end of allPageButtons
            allPageButtons = allPageButtons + "<span class='parametric__pagination-page-button' data-page='next'>></span><span class='parametric__pagination-page-button' data-page='last'>>></span>";

            return allPageButtons;

        });

    }


    /*
     * Sorts JSON data array based on data-sortby and data-sortorder
     */
    function sortData() {

        var parametricChart = $(".parametric .parametric-table");
        var columnToSortBy = parametricChart.attr("data-sortby");
        var sortOrder = parametricChart.attr("data-sortorder");

        // Sort visibleRowData array based on sortOrder and columnToSortBy
        visibleRowData.sort(function (a, b) {

            var compareValue;
            var compareTo;

            if (sortOrder == 0) {
                compareValue = a[columnToSortBy];
                compareTo = b[columnToSortBy];
            }
            else if (sortOrder == 1) {
                compareValue = b[columnToSortBy];
                compareTo = a[columnToSortBy];
            }

            if (compareValue.startsWith('$')) compareValue = compareValue.slice(1);
            if (compareTo.startsWith('$')) compareTo = compareTo.slice(1);

            if (isNaN(compareValue) || isNaN(compareTo)) {
                return compareValue.toLowerCase() > compareTo.toLowerCase() ? 1 : -1;
            }
            return compareValue - compareTo;

        });

        // Add arrow to end of sorted column header based on sortOrder
        var sortedColumnHeader = $(".parametric .parametric-table .table__row--header")
            .find(".table__cell")[columnToSortBy];

        $(".parametric .sort-indicator").remove(); // remove all sort indicators
        $(sortedColumnHeader).append("<span class='sort-indicator'></span>");
        $(sortedColumnHeader).find(".sort-indicator").html(function () {
            return (sortOrder == 0 ? " <i class='fa fa-caret-down' aria-hidden='true'></i>" : (sortOrder == 1 ? " <i class='fa fa-caret-up' aria-hidden='true'></i>" : ""));
        });

    }


    /*
     * Returns an array of visible column ids
     * @return array
     */
    function getVisibleColumnHeaders() {

        // Array of visible header ids
        var visibleHeaders = ["0"]; // always show Products column (index of "0")

        // Array of all checked header elements
        var checkedHeaders = $(".parametric__columns-list input[type=checkbox]:checked");

        // Loop through checkedHeaders and push id of each header to visibleHeaders
        $.each(checkedHeaders, function (index, value) {
            visibleHeaders.push($(this).attr("id").split("tableHeader")[1]);
        });

        return visibleHeaders;

    };


    /*
     * Searches parametric tables for specified search term
     * @param e [optional]
          - the event that called searchTable
     */
    function searchTable(e) {

        // Clear search input if escape key is pressed
        if (e != null && e.keyCode == 27) {
            clearSearch();
            return;
        }

        // Remove no results message and show parametric chart
        if ($(".parametric__message").length) {
            $(".parametric .parametric__message").remove();
            $(".parametric .parametric__chart").show();
        }

        // Search term from search input box
        var searchTerm = $(".parametric .parametric__search input").val();

        // Get indexes of all visible columns
        var visibleColumnIndexes = getVisibleColumnHeaders();

        // Array of row data of rows that contain searchTerm
        var containingRowData = [];

        // Loop through allRowData
        $.each(allRowData, function (rowIndex, data) {

            // Loop through all columns in each data set
            $.each(data, function (index, value) {

                // Check if current column index is visible and return if not
                if (visibleColumnIndexes.indexOf(index.toString()) === -1) return;

                // Add row data to containingRowData if column includes searchTerm
                if (value.toLowerCase().includes(searchTerm.toLowerCase())) {
                    containingRowData.push(data);
                    return false;
                }

            });

        });

        // Set visibleRowData to containingRowData
        visibleRowData = containingRowData;

        // Reset current page to 0
        currentPage = 0;

        //Re-build table
        sortData();
        buildTable();

        // Check if containingRowData contains data
        if (containingRowData.length <= 0) {

            // Hide parametric chart and show no results message
            $(".parametric .parametric__chart").hide();
            $(".parametric")
                .append("<div class='parametric__message'>No results.</div>");

        }

    }


    /*
     * Clears parametric chart search field
     */
    function clearSearch() {

        // Empty search input box
        $(".parametric .parametric__search input").val("");

        // Re-search chart
        searchTable();

    }


    /*
     * Restripes table rows
     */
    function restripeRows() {

        // Loop through each visible table row
        $(".parametric .table__row:not(.table__row--header):visible")
            .each(function (index) {

                // Color odd/even row backgrounds differently
                if (index % 2 === 0) {
                    $(this).find(".table__cell").css("background-color", "#FFF");
                } else {
                    $(this).find(".table__cell").css("background-color", "#F4F4F4");
                }

            });

    }

    /*
        code relies on page to have global variable of 'parametricBranchData'
        - array of branch information, each item is an object containing a
        branchID, branchName, and array of defaultColumns
    */

    function parametricHasNoData() {
        if (typeof (parametricBranchData) === "undefined" || parametricBranchData.length <= 0 || parametricBranchData[0].branchID === 0) {
            return true;
        } else {
            return false;
        }
    }

    /*
     * Resize columns based on number displayed
     */
    function resizeColumns() {

        // Number of columns checked
        var numColumnsChecked = $(".parametric__columns-list input[type=checkbox]:checked").length;

        // Change widths of all table cells to percentage based on number of columns
        $(".parametric")
            .find("[class*='table__cell']")
            .css("width", (100 / numColumnsChecked) + "%");

    }

    function init() {
        if (parametricHasNoData()) return;

        $('.parametric').empty();
        
        $(document).ready(function () {        
            initVariable();
            // Retrieve JSON data for visible branch's ID
            getJSONDataAndRender(branchData[visibleBranchIndex]["branchID"], writeParametricChartHTML);
            loadChart();


         /*
         * Handle clicking of item in parametric title dropdown
         */
            $(document).on("click", ".parametric__title-options > li", function () {
                // Disallow changing of branch when data is loading
                if (!dataLoaded) return;

                // Return if click is on currently active branch
                if ($(this).hasClass("active")) return;

                $(".parametric__title-options .active").removeClass("active");
                $(this).addClass("active");
                $(".parametric__title-text-name").text($(this).text());

                visibleBranchIndex = $(this).index();
                currentPage = 0;

                getJSONDataAndRender($(this).attr("data-branchid"));
                loadChart();

            });


            /*
             * Handle clicking of any pagination button
             */
            $(document).on("click", ".parametric__pagination-page-button", function () {

                var dataPage = $(this).attr("data-page");
                var newPage = (isNaN(dataPage) ? dataPage : parseInt(dataPage));
                var lastPage = Math.ceil(visibleRowData.length / rowsPerPage);

                switch (newPage) {

                    case 'first':
                        currentPage = 0;
                        break;

                    case 'last':
                        currentPage = lastPage - 1;
                        break;

                    case 'prev':
                        if ((currentPage - 1) >= 0) {
                            currentPage--;
                        } else {
                            return;
                        }
                        break;

                    case 'next':
                        if ((currentPage + 1) <= (lastPage - 1)) {
                            currentPage++;
                        } else {
                            return;
                        }
                        break;

                    default:
                        if (currentPage === newPage) return;
                        currentPage = newPage;
                        break;

                }

                buildTable();

            });


            /*
             * Handle clicking of table column header
             */
            $(document).on("click", ".parametric .table__row--header .table__cell", function () {

                var parametricChart = $(".parametric .parametric-table");
                var columnToSortBy = $(this).index();
                var newColumnSelected = false;

                if (parametricChart.attr("data-sortby") != columnToSortBy
                    || !parametricChart.attr("data-sortby")) {
                    newColumnSelected = true;
                }

                parametricChart.attr("data-sortby", columnToSortBy);
                parametricChart.attr("data-sortorder", function () {
                    var newSortOrder = parametricChart.attr("data-sortorder") || -1;
                    if (newColumnSelected) newSortOrder = -1;
                    newSortOrder++;
                    return (newSortOrder < 2 ? newSortOrder : 0);
                });

                sortData();
                buildTable();

            });


            /*
             * Handle clicking of column menu close button
             */
            $(document).on("click", ".parametric .columns-list__close", function () {

                // Uncheck columns toggle box if columns list is visible
                if ($(".parametric__columns-list").css("display") === "block") {
                    $(".parametric__columns-toggle-box").prop("checked", false);
                }

            });


            /*
             * Handle clicking of reset column button in column menu
             */
            $(document).on("click", ".parametric .columns-list__reset", function () {

                // Rebuild table with newData set to true
                buildTable(true);

            });


            /*
             * On change of header checkboxes
             */
            $(document).on("change", ".parametric .table__header-checkbox", function () {

                var headerNumber = $(this).attr("id").split("tableHeader")[1];
                var checked = $(this).prop("checked");

                $(".parametric").find("[class*='table__row']").each(function () {
                    $(this)
                        .find(".table__cell")[headerNumber].style.display = (checked ? "inline-block" : "none");
                });

                var parametricChart = $(".parametric .parametric-table");
                if (parametricChart.attr("data-sortby") == headerNumber && !checked) {
                    parametricChart.attr("data-sortby", "0");
                    parametricChart.attr("data-sortorder", "0");
                    sortData();
                }

                searchTable();
                resizeColumns();

            });


            /*
             * Hide/show elements based on clicks in document
             */
            $(document).off("click", ".parametric__title").on("click", ".parametric__title", function (e) {

                if (parametricHasNoData() || branchData.length <= 1) return;

                var options = $(".parametric__title-options");
                var title = $(".parametric__title");
                var titleText = $(".parametric__title-text");
                var columnsToggleBox = $(".parametric__columns-toggle-box");
                var columnsToggle = $(".parametric__columns-toggle");
                var columnsList = $(".parametric__columns-list");

                // Disallow column toggle menu from showing if data isn't loaded
                if (columnsToggle.is(e.target)) {
                    if (!dataLoaded) e.preventDefault();
                }

                // Hide options with any click on page
                //if (!options.is(e.target) && options.has(e.target).length === 0) {
                if (options.css("display") === "block") {
                    options.hide();
                    titleText.css("opacity", "1");
                    return;
                }
                //}

                // Show options if click is on parametric title
                if (title.is(e.target) || title.has(e.target).length > 0) {
                    if (!dataLoaded) return;
                    options.show();
                    titleText.css("opacity", ".3");
                }

                // Hide column dropdown if click is outside of visible dropdown menu
                if (!columnsToggle.is(e.target)
                    && !columnsToggleBox.is(e.target)
                    && !columnsList.is(e.target)
                    && columnsList.has(e.target).length === 0) {

                    if (columnsList.css("display") === "block") {
                        columnsToggleBox.prop("checked", false);
                    }

                }

            });
        });
    };


    return {
        init: init,
        searchTable: searchTable,
        clearSearch: clearSearch
    }
}();






