/*!
    * Start Bootstrap - Grayscale v6.0.2 (https://startbootstrap.com/themes/grayscale)
    * Copyright 2013-2020 Start Bootstrap
    * Licensed under MIT (https://github.com/StartBootstrap/startbootstrap-grayscale/blob/master/LICENSE)
    */
    (function ($) {
    "use strict"; // Start of use strict

    // Smooth scrolling using jQuery easing
    $('a.js-scroll-trigger[href*="#"]:not([href="#"])').click(function () {
        if (
            location.pathname.replace(/^\//, "") ==
                this.pathname.replace(/^\//, "") &&
            location.hostname == this.hostname
        ) {
            var target = $(this.hash);
            target = target.length
                ? target
                : $("[name=" + this.hash.slice(1) + "]");
            if (target.length) {
                $("html, body").animate(
                    {
                        scrollTop: target.offset().top - 70,
                    },
                    1000,
                    "easeInOutExpo"
                );
                return false;
            }
        }
    });

    // Closes responsive menu when a scroll trigger link is clicked
    $(".js-scroll-trigger").click(function () {
        $(".navbar-collapse").collapse("hide");
    });

    // Activate scrollspy to add active class to navbar items on scroll
    $("body").scrollspy({
        target: "#mainNav",
        offset: 100,
    });

    // Collapse Navbar
    var navbarCollapse = function () {
        if ($("#mainNav").offset().top > 100) {
            $("#mainNav").addClass("navbar-shrink");
        } else {
            $("#mainNav").removeClass("navbar-shrink");
        }
    };
    // Collapse now if page is not at top
    navbarCollapse();
    // Collapse the navbar when page is scrolled
    $(window).scroll(navbarCollapse);
})(jQuery); // End of use strict


// 添加新聞數據載入功能
async function loadNewsData() {
    try {
        const response = await fetch('tests.csv');
        const csvText = await response.text();
        
        Papa.parse(csvText, {
            header: true,
            complete: function(results) {
                const tableBody = document.querySelector('#newsTable tbody');
                let counter = 1; // 用於生成ID
                
                tableBody.innerHTML = results.data
                    .filter(row => row.Time && row.Title) // 過濾掉空行
                    .map(row => `
                        <tr>
                            <td>${counter++}</td>
                            <td style="text-align: left">
                                <a href="${row.Link}" target="_blank">${row.Title}</a>
                            </td>
                            <td>${row.Time}</td>
                            <td>${row.Source}</td>
                        </tr>
                    `).join('');
            },
            error: function(error) {
                console.error('Error parsing CSV:', error);
            }
        });
    } catch (error) {
        console.error('Error loading CSV:', error);
    }
}

// 當文檔加載完成時執行
document.addEventListener('DOMContentLoaded', loadNewsData);

function toggleFullScreen() {
    const container = document.getElementById('newsTableContainer');
    
    if (!container) {
        console.error('找不到newsTableContainer元素');
        return;
    }

    if (!document.fullscreenElement) {
        // 進入全螢幕
        if (container.requestFullscreen) {
            container.requestFullscreen();
        } else if (container.webkitRequestFullscreen) {
            container.webkitRequestFullscreen();
        } else if (container.mozRequestFullScreen) {
            container.mozRequestFullScreen();
        } else if (container.msRequestFullscreen) {
            container.msRequestFullscreen();
        }
    } else {
        // 退出全螢幕
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
        } else if (document.mozCancelFullScreen) {
            document.mozCancelFullScreen();
        } else if (document.msExitFullscreen) {
            document.msExitFullscreen();
        }
    }
}

// 監聽全螢幕變化
document.addEventListener('fullscreenchange', handleFullscreenChange);
document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
document.addEventListener('mozfullscreenchange', handleFullscreenChange);
document.addEventListener('MSFullscreenChange', handleFullscreenChange);

function handleFullscreenChange() {
    const container = document.getElementById('newsTableContainer');
    if (!document.fullscreenElement) {
        // 退出全螢幕時恢復原始樣式
        container.style.backgroundColor = '';
        container.style.padding = '';
        container.style.width = '70%';
    }
}