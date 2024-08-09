import React, { useEffect, useState } from "react";
import axios from "axios";
import Nav from "../component/Nav";
import {
  setCurrentPage,
  setItemsPerPage,
} from "../redux/reducers/IdeasReducers";
import { useDispatch, useSelector } from "react-redux";

export default function Ideas() {
  const [ideas, setIdeas] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [sortOrder, setSortOrder] = useState("-published_at");
  const [total, setTotal] = useState([]);

  const dispatch = useDispatch();

  const currentPage = useSelector((state) => state?.ideas?.currentPage);
  const itemsPerPage = useSelector((state) => state?.ideas?.itemsPerPage);

  useEffect(() => {
    const fetchIdeas = async (page = 1) => {
      try {
        const response = await axios.get("/api/ideas", {
          params: {
            "page[number]": page,
            "page[size]": itemsPerPage,
            "append[]": ["small_image", "medium_image"],
            sort: sortOrder,
          },
        });

        setIdeas(response?.data?.data);
        setTotal(response?.data);
        dispatch(setCurrentPage(response?.data?.meta?.current_page));
        setTotalPages(response?.data?.meta?.last_page);
      } catch (error) {
        // console.error("Error fetching data:", error);
      }
    };

    fetchIdeas(currentPage);
  }, [currentPage, itemsPerPage, sortOrder]);

  //* format tanggal
  const formatDate = (dateString) => {
    const options = { day: "numeric", month: "long", year: "numeric" };
    return new Date(dateString).toLocaleDateString("id-ID", options);
  };

  //* pagination
  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      dispatch(setCurrentPage(page));
    }
  };

  const getPaginationNumbers = () => {
    const maxVisiblePages = 5;
    let start = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let end = Math.min(totalPages, start + maxVisiblePages - 1);

    if (end - start < maxVisiblePages - 1) {
      start = Math.max(1, end - maxVisiblePages + 1);
    }

    return Array.from({ length: end - start + 1 }, (_, idx) => start + idx);
  };

  const handleItemsPerPageChange = (e) => {
    dispatch(setItemsPerPage(Number(e?.target?.value)));
    dispatch(setCurrentPage(1));
  };

  //* fungsi sorting
  const handleSortChange = (e) => {
    setSortOrder(e?.target?.value);
  };

  const startItem = total?.meta?.from;
  const endItem = total?.meta?.to;
  const totalItems = total?.meta?.total;

  //* fungsi paralax
  useEffect(() => {
    const parallaxEffect = () => {
      const parallaxBg = document.querySelector(".parallax-bg");
      const scrollPosition = window.pageYOffset;
      parallaxBg.style.transform = `translateY(${scrollPosition * 0.5}px)`;
    };

    // Apply effect on page load
    parallaxEffect();

    // Apply effect on scroll
    window.addEventListener("scroll", parallaxEffect);

    // Cleanup event listener on unmount
    return () => {
      window.removeEventListener("scroll", parallaxEffect);
    };
  }, []);

  return (
    <div>
      {/* Header */}
      <div className="relative h-[500px] max-sm:h-[600px] overflow-hidden">
        <div className="relative z-20">
          <Nav />
        </div>

        {/* Banner  */}
        <div className="bg-home-bg absolute top-0 left-0 w-full h-full bg-cover sm:bg-bottom max-sm:bg-top parallax-bg"></div>
        <div className="relative z-10 container flex flex-col justify-center p-6 mx-auto sm:py-12 sm:px-48 lg:py-20 lg:flex-row sm:text-center">
          <h1 className="text-white mt-24 max-sm:text-center">
            <span className="tracking-wide font-medium sm:text-5xl max-sm:text-2xl">
              Ideas
            </span>
            <p className="tracking-normal sm:text-base max-sm:mt-2 font-light sm:w-[400px] max-sm:px-5 max-sm:text-xs">
              Where all our great things begin
            </p>
          </h1>
        </div>
      </div>

      {/* Fungsi Sorting  */}
      <div>
        <div className="sm:flex justify-between items-center my-4 lg:px-28 mt-20 text-sm max-sm:text-center">
          <div className="">
            <p>
              Showing {startItem}-{endItem} of {totalItems}
            </p>
          </div>
          <div className="flex sm:space-x-10 max-sm:mt-5 max-sm:text-xs">
            <div className="sm:flex items-center">
              <span className="sm:mr-5 max-sm:mr-1 ">Show per page:</span>
              <select
                value={itemsPerPage}
                onChange={handleItemsPerPageChange}
                className="border border-gray-300 cursor-pointer rounded-full w-24 h-10 px-3 p-1 "
              >
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
              </select>
            </div>
            <div className="sm:flex items-center">
              <span className="sm:mr-5 max-sm:mr-1 ">Sort by:</span>
              <select
                value={sortOrder}
                onChange={handleSortChange}
                className="border border-gray-300 cursor-pointer rounded-full w-28  h-10 px-3  p-1"
              >
                <option value="-published_at">Newest</option>
                <option value="published_at">Oldest</option>
              </select>
            </div>
          </div>
        </div>

        {/* API FETCHING */}
        <div className="container mx-auto p-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 mt-5 lg:px-28">
          {ideas?.map((e, i) => (
            <div key={i} className="bg-white p-4 rounded-lg shadow-lg">
              <img
                src={e?.small_image[0]?.url}
                loading="lazy"
                className="w-full h-40 object-cover rounded-t-lg"
              />
              <div className="p-4">
                <p className="text-xs text-gray-500">
                  {formatDate(e?.published_at)}
                </p>
                <h2 className="text-base font-semibold line-clamp-3">
                  {e?.title}
                </h2>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Pagination */}
      <div className="flex justify-center items-center space-x-2 mt-8 mb-10">
        <button
          className={`py-2 bg-white font-bold rounded  ${
            currentPage === 1 && "cursor-not-allowed opacity-50"
          }`}
          onClick={() => goToPage(1)}
          disabled={currentPage === 1}
        >
          {"<<"}
        </button>

        <button
          className={`sm:px-4 max-sm:px-2 py-2 bg-white font-bold rounded  ${
            currentPage === 1 && "cursor-not-allowed opacity-50"
          }`}
          onClick={() => goToPage(currentPage - 1)}
          disabled={currentPage === 1}
        >
          {"<"}
        </button>

        {getPaginationNumbers().map((pageNumber) => (
          <button
            key={pageNumber}
            onClick={() => goToPage(pageNumber)}
            className={`sm:px-2 max-sm:px-1 py-2 rounded  ${
              pageNumber === currentPage
                ? "bg-orange-600 text-white text-xs"
                : "bg-white text-xs"
            }`}
          >
            {pageNumber}
          </button>
        ))}

        <button
          className={`sm:px-4 max-sm:px-2 py-2 bg-white font-bold rounded ${
            currentPage === totalPages && "cursor-not-allowed opacity-50"
          }`}
          onClick={() => goToPage(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          {">"}
        </button>

        <button
          className={` py-2 bg-white font-bold rounded ${
            currentPage === totalPages && "cursor-not-allowed opacity-50"
          }`}
          onClick={() => goToPage(totalPages)}
          disabled={currentPage === totalPages}
        >
          {">>"}
        </button>
      </div>
    </div>
  );
}
