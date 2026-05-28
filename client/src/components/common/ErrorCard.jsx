const ErrorCard = ({ message, onRetry }) => {
  return (
    <div className="rounded-3xl border border-red-400/20 bg-red-400/10 p-5 text-sm text-red-100 shadow-sm shadow-red-500/5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p>{message || "Something went wrong."}</p>
        {onRetry ? (
          <button
            type="button"
            onClick={onRetry}
            className="rounded-2xl bg-red-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-400"
          >
            Retry
          </button>
        ) : null}
      </div>
    </div>
  );
};

export default ErrorCard;
