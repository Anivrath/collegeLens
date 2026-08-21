"use client";

type AnswerCardProps = {
  answer: {
    id: number;
    content: string;
    isAccepted: boolean;
    createdAt: string;
    user: {
      id: number;
      name: string;
      email: string;
    };
  };
  isQuestionAuthor: boolean;
  currentUserId: string | null;
  onAccept: (answerId: number) => void;
};

export default function AnswerCard({
  answer,
  isQuestionAuthor,
  currentUserId,
  onAccept,
}: AnswerCardProps) {
  return (
    <div
      className={`rounded-lg border p-6 ${
        answer.isAccepted ? "border-green-500 bg-green-50" : "bg-white"
      }`}
    >
      {answer.isAccepted && (
        <div className="mb-3 flex items-center gap-2 text-green-700">
          <span className="text-xl">✓</span>
          <span className="font-semibold">Accepted Answer</span>
        </div>
      )}

      <div className="mb-4 whitespace-pre-wrap text-gray-800">
        {answer.content}
      </div>

      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-500">
          <span className="font-medium">{answer.user.name}</span>
          <span className="mx-2">•</span>
          <span>{new Date(answer.createdAt).toLocaleDateString()}</span>
        </div>

        {isQuestionAuthor && !answer.isAccepted && (
          <button
            onClick={() => onAccept(answer.id)}
            className="rounded-lg border border-green-600 px-4 py-1 text-sm text-green-600 hover:bg-green-50"
          >
            Accept Answer
          </button>
        )}
      </div>
    </div>
  );
}
