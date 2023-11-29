const calculateItemsForPage = async ({ list, itemsPerPage, page, pages }) => {
  try {
    let _list = list || [];
    let _page = page || 0;
    let _pages = page && pages ? pages : 0;
    let _itemsPerPage = itemsPerPage || 25;

    let selectedList = [];

    for (var i = 0; i < _list.length; i++) {
      if (i >= (_page - 1) * _itemsPerPage && i < _page * _itemsPerPage) {
        selectedList.push(_list[i]);
      }
    }

    return { data: selectedList };
  } catch (error) {
    return {
      error: error.message || "Products not listed",
    };
  }
};

export default calculateItemsForPage;
