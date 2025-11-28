import React from "react";
import { useSelector } from "react-redux";
import Spinner from "@/custom-components/Spinner";

const Leaderboard = () => {
  const { loading, leaderboard } = useSelector((state) => state.user);

  return (
    <section className="w-full ml-0 m-0 h-fit px-5 pt-20 lg:pl-[320px] flex flex-col min-h-screen">
      {loading ? (
        <Spinner />
      ) : (
        <div className="my-8">
          <h1 className="text-4xl md:text-6xl font-bold mb-2 text-[var(--foreground)]">
            Top Bidders
          </h1>
          <p className="text-lg text-[var(--muted-foreground)] mb-8">
            See who's leading the pack with the most auctions won and highest spending.
          </p>
          
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-16">Rank</th>
                    <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                    <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Money Spent</th>
                    <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Auctions Won</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {leaderboard.slice(0, 100).map((element, index) => (
                    <tr key={element._id} className="hover:bg-gray-50">
                      <td className="py-4 px-6 text-lg font-bold text-gray-400">{index + 1}</td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-4">
                          <img
                            src={element.profileImage?.url}
                            alt={element.userName}
                            className="h-10 w-10 object-cover rounded-full"
                          />
                          <span className="font-semibold text-gray-800">{element.userName}</span>
                        </div>
                      </td>
                      <td className="py-4 px-6 font-semibold text-gray-800">${element.moneySpent.toLocaleString()}</td>
                      <td className="py-4 px-6 font-semibold text-gray-800">{element.auctionsWon}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default Leaderboard;