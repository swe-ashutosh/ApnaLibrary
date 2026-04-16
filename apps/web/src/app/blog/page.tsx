import Footer from "@/components/Footer";

export default function BlogPage() {
  const blogs = [
    {
      title: "Top 5 study habits for UPSC",
      date: "April 10, 2026",
      img: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&q=80&w=600",
    },
    {
      title: "How Apna Library boost focus",
      date: "April 08, 2026",
      img: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&q=80&w=600",
    },
    {
      title: "Managing exam stress 101",
      date: "April 05, 2026",
      img: "https://images.unsplash.com/photo-1493612276216-ee3925520721?auto=format&fit=crop&q=80&w=600",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-grow pt-20 px-6 md:px-20 max-w-7xl mx-auto w-full">
        <h1 className="text-4xl font-bold mt-10 mb-10">
          Latest <span className="text-brandPurple">Articles</span>
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          {blogs.map((post) => (
            <div
              key={post.title}
              className="glass-card overflow-hidden hover:border-brandPurple transition-all cursor-pointer group"
            >
              <img
                src={post.img}
                className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="p-6">
                <span className="text-xs text-brandPurple font-bold uppercase">
                  {post.date}
                </span>
                <h3 className="text-lg font-bold mt-2 group-hover:text-brandPurple transition-colors">
                  {post.title}
                </h3>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
