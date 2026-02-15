import { Link } from 'react-router-dom';
import { Calendar, User } from 'lucide-react';
import Img from '../ui/Img';

const PostCard = ({ post }) => {
  return (
    <article className="flex flex-col bg-(--card) border border-(--border) rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300 group">
      <Link
        to={`/blog/${post.slug}`}
        className="block relative overflow-hidden aspect-video"
      >
        <Img
          src={post.featuredImage?.url}
          alt={post.title}
          className="group-hover:scale-105 transition-transform duration-500"
        />
        {post.category && (
          <span className="absolute top-3 right-3 bg-black/60 backdrop-blur-md text-white text-xs font-semibold px-2.5 py-1 rounded-full border border-white/10">
            {post.category}
          </span>
        )}
      </Link>

      <div className="flex flex-col grow p-5">
        <div className="flex items-center gap-3 text-xs text-(--secondary) mb-3">
          <div className="flex items-center gap-1">
            <User className="w-3.5 h-3.5" />
            <span>{post.author?.fullName || 'Admin'}</span>
          </div>
          <div className="flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5" />
            <time>
              {new Date(
                post.publishedAt || post.createdAt
              ).toLocaleDateString()}
            </time>
          </div>
        </div>

        <Link
          to={`/blog/${post.slug}`}
          className="block group-hover:text-primary transition-colors"
        >
          <h2 className="text-xl font-bold leading-snug mb-3 line-clamp-2">
            {post.title}
          </h2>
        </Link>

        <p className="text-(--secondary) text-sm line-clamp-3 mb-4 flex-grow">
          {post.excerpt ||
            post.metaDescription ||
            'Click to read this article...'}
        </p>
      </div>
    </article>
  );
};

export default PostCard;
