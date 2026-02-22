import { Link } from 'react-router-dom';
import { Calendar, User } from 'lucide-react';
import Img from '../ui/Img';

const PostCard = ({ post }) => {
  if (!post) return null;

  return (
    <article className="flex flex-col bg-(--card) border border-(--border) rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300 group">
      <Link
        to={`/blog/${post?.slug}`}
        className="block relative overflow-hidden aspect-video"
      >
        <Img
          src={post?.featuredImage?.url}
          alt={post?.title}
          className="group-hover:scale-105 transition-transform duration-500"
        />
        {post?.category && (
          <span className="absolute top-3 right-3 bg-black/60 backdrop-blur-md text-white text-xs font-semibold px-2.5 py-1 rounded-full border border-white/10">
            {post.category}
          </span>
        )}
      </Link>

      <div className="flex flex-col grow p-5">
        <div className="flex items-center gap-3 text-xs text-(--secondary) mb-3">
          <div className="flex items-center gap-2">
            {post?.author?.profilePicture ? (
              <div className="w-6 h-6 rounded-full overflow-hidden border border-(--border)">
                <Img
                  src={post.author.profilePicture}
                  alt={post?.author?.fullName}
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              <div className="w-6 h-6 rounded-full bg-(--secondary)/10 flex items-center justify-center text-(--secondary)">
                <User className="w-3.5 h-3.5" />
              </div>
            )}
            <span className="font-medium text-(--foreground)">
              {post?.author?.fullName || 'Admin'}
            </span>
          </div>
          <div className="flex items-center gap-1 ml-auto">
            <Calendar className="w-3.5 h-3.5" />
            <time>
              {post?.publishedAt || post?.createdAt
                ? new Date(
                    post.publishedAt || post.createdAt
                  ).toLocaleDateString()
                : 'Unknown Date'}
            </time>
          </div>
        </div>

        <Link
          to={`/blog/${post?.slug}`}
          className="block group-hover:text-primary"
        >
          <h2 className="text-xl font-bold leading-snug mb-3 line-clamp-2 text-(--foreground)">
            {post?.title}
          </h2>
        </Link>

        <p className="text-(--secondary) text-sm line-clamp-3 mb-4 grow">
          {post?.excerpt ||
            post?.metaDescription ||
            'Click to read this article...'}
        </p>
      </div>
    </article>
  );
};

export default PostCard;
