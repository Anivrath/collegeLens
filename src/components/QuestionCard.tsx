import Link from "next/link";

type QuestionCardProps = {
  question: {
    id: number;
    title: string;
    content: string;
    viewCount: number;
    isClosed: boolean;
    createdAt: string;
    user: {
      name: string;
      email: string;
    };
    college?: {
      name: string;
      slug: string;
    } | null;
    _count?: {
      answers: number;
    };
  };
};

export default function QuestionCard({ question }: QuestionCardProps) {
  return (
    <Link
      href={`/qa/${question.id}`}
      className="block rounded-xl border bg-white p-6 shadow-sm hover:shadow-md transition-shadow"
    >
      <div className="mb-3 flex items-start justify-between">
        <h3 className="flex-1 text-lg font-semibold text-black hover:underline">
          {question.title}
        </h3>
        {question.isClosed && (
          <span className="ml-2 rounded-full bg-gray-200 px-3 py-1 text-xs font-medium text-gray-700">
            Closed
          </span>
        )}
      </div>

      <p className="mb-4 line-clamp-2 text-gray-600">
        {question.content}
      </p>

      {question.college && (
        <div className="mb-3">
          <Link
            href={`/colleges/${question.college.slug}`}
            className="inline-flex items-center rounded-lg bg-gray-100 px-2 py-1 text-xs font-medium text-gray-700 hover:bg-gray-200"
            onClick={(e) => e.stopPropagation()}
          >
            🏫 {question.college.name}
          </Link>
        </div>
      )}

      <div className="flex items-center justify-between text-sm text-gray-500">
        <div className="flex items-center gap-4">
          <span>👤 {question.user.name}</span>
          <span>💬 {question._count?.answers || 0} answers</span>
          <span>👁️ {question.viewCount} views</span>
        </div>
        <span>{new Date(question.createdAt).toLocaleDateString()}</span>
      </div>
    </Link>
  );
}
