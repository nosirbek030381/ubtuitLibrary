window.addEventListener("DOMContentLoaded", () => {
  //   window.addEventListener('scroll', () => {
  //     const header = document.querySelector('header')
  //     header.classList.toggle('sticky', window.scrollY > 0)
  //   })

  function getPageList(totalPages, page, maxLength) {
    function range(start, end) {
      return Array.from({ length: end - start + 1 }, (_, i) => start + i);
    }

    let sideWidth = maxLength < 9 ? 1 : 2;
    let leftWidth = (maxLength - sideWidth * 2 - 3) >> 1;
    let rightWidth = (maxLength - sideWidth * 2 - 3) >> 1;

    if (totalPages <= maxLength) {
      return range(1, totalPages);
    }

    if (page <= maxLength - sideWidth - 1 - rightWidth) {
      return range(1, maxLength - sideWidth - 1).concat(
        0,
        range(totalPages - sideWidth + 1, totalPages)
      );
    }

    if (page >= totalPages - sideWidth - 1 - rightWidth) {
      return range(1, sideWidth).concat(
        0,
        range(totalPages - sideWidth - 1 - rightWidth - leftWidth, totalPages)
      );
    }

    return range(1, sideWidth).concat(
      0,
      range(page - leftWidth, page + rightWidth),
      0,
      range(totalPages - sideWidth + 1, totalPages)
    );
  }

  $(function () {
    let numberOfItems = $(".card__content .card").length;
    let limitPerPage = 6;
    let totalPages = Math.ceil(numberOfItems / limitPerPage);
    let paginationSize = 7;
    let currentPage;

    function showPage(whichPage) {
      if (whichPage < 1 || whichPage > totalPages) return false;

      currentPage = whichPage;

      $(".card__content .card")
        .hide()
        .slice((currentPage - 1) * limitPerPage, currentPage * limitPerPage)
        .show();

      $(".paginations li").slice(1, -1).remove();

      getPageList(totalPages, currentPage, paginationSize).forEach((item) => {
        $("<li>")
          .addClass("page__item")
          .addClass(item ? "current__page" : "dots")
          .toggleClass("activ", item === currentPage)
          .append(
            $("<a>")
              .addClass("page__link")
              .attr({ href: "javascript:void(0)" })
              .text(item || "...")
          )
          .insertBefore(".next__page");
      });
      $(".previous__page").toggleClass("disabled", currentPage === 1);
      $(".next__page").toggleClass("disabled", currentPage === totalPages);
      return true;
    }

    $(".paginations").append(
      $("<li>")
        .addClass("page__item")
        .addClass("previous__page")
        .append(
          $("<a>")
            .addClass("page__link")
            .attr({ href: "javascript:void(0)" })
            .text("Prev")
        ),
      $("<li>")
        .addClass("page__item")
        .addClass("next__page")
        .append(
          $("<a>")
            .addClass("page__link")
            .attr({ href: "javascript:void(0)" })
            .text("Next")
        )
    );

    $(".card__content").show();
    showPage(1);

    $(document).on(
      "click",
      ".paginations li.current__page:not(activ)",
      function () {
        return showPage(+$(this).text());
      }
    );

    $(".next__page").on("click", function () {
      return showPage(currentPage + 1);
    });

    $(".previous__page").on("click", function () {
      return showPage(currentPage - 1);
    });
  });
});
