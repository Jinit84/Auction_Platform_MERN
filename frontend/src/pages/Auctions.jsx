import React, { useState, useMemo } from "react";
import { useSelector } from "react-redux";
import Card from "@/custom-components/Card";
import Spinner from "@/custom-components/Spinner";
import { FiSearch } from "react-icons/fi";

const auctionCategories = [
  "All Categories",
  "Electronics",
  "Furniture",
  "Art & Antiques",
  "Jewelry & Watches",
  "Automobiles",
  "Real Estate",
  "Collectibles",
  "Fashion & Accessories",
  "Sports Memorabilia",
  "Books & Manuscripts",
];

const Auctions = () => {
  const { allAuctions, loading } = useSelector((state) => state.auction);
  const [searchTerm, setSearchTerm] = useState("");
  const [category, setCategory] = useState("All Categories");
  const [sortBy, setSortBy] = useState("ending-soon");

  const filteredAndSortedAuctions = useMemo(() => {
    let filtered = allAuctions;

    // Filter by category
    if (category !== "All Categories") {
      filtered = filtered.filter((item) => item.category === category);
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter((item) =>
        item.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Sort the filtered items
    const sorted = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case "ending-soon":
          return new Date(a.endTime) - new Date(b.endTime);
        case "newly-listed":
          return new Date(b.startTime) - new Date(a.startTime);
        case "price-low-high":
          return a.startingBid - b.startingBid;
        case "price-high-low":
          return b.startingBid - a.startingBid;
        default:
          return 0;
      }
    });

    return sorted;
  }, [allAuctions, searchTerm, category, sortBy]);

  return (
    <article className="w-full ml-0 m-0 h-fit px-5 pt-20 lg:pl-[320px] flex flex-col min-h-screen">
      <section className="my-8">
        <h1 className="text-4xl md:text-6xl font-bold mb-2 text-[var(--foreground)]">
          Live Auctions
        </h1>
        <p className="text-lg text-[var(--muted-foreground)] mb-8">
          Find the perfect item from our curated collection of auctions.
        </p>

        {/* Filter and Sort Controls */}
        <div className="bg-white p-4 rounded-lg shadow-md mb-8 grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
          <div className="relative md:col-span-1">
            <input
              type="text"
              placeholder="Search by title..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full p-2 pl-10 border rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--brand)]"
            />
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          </div>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--brand)]"
          >
            {auctionCategories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--brand)]"
          >
            <option value="ending-soon">Sort by: Ending Soon</option>
            <option value="newly-listed">Sort by: Newly Listed</option>
            <option value="price-low-high">Sort by: Price Low to High</option>
            <option value="price-high-low">Sort by: Price High to Low</option>
          </select>
        </div>

        {/* Auction Grid */}
        {loading ? (
          <Spinner />
        ) : filteredAndSortedAuctions.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
            {filteredAndSortedAuctions.map((element) => (
              <Card
                title={element.title}
                startTime={element.startTime}
                endTime={element.endTime}
                imgSrc={element.image?.url}
                startingBid={element.startingBid}
                id={element._id}
                key={element._id}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-lg shadow-md">
            <h3 className="text-2xl font-semibold text-[var(--foreground)]">No Auctions Found</h3>
            <p className="text-[var(--muted-foreground)] mt-2">
              Try adjusting your search or filter settings.
            </p>
          </div>
        )}
      </section>
    </article>
  );
};

export default Auctions;