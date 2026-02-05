import { toast } from "sonner";
import { Trash2, AlertTriangle } from "lucide-react";

export const confirmDelete = (onConfirm: () => void) => {
  toast.custom(
    (t) => (
      <div className="w-[420px] rounded-3xl bg-neutral-950 border border-white/15 p-6 shadow-2xl">
        {/* Header */}
        <div className="flex items-start gap-4">
          <div className="h-11 w-11 flex items-center justify-center rounded-full bg-red-500/15 text-red-400">
            <AlertTriangle className="w-5 h-5" />
          </div>

          <div className="flex-1">
            <h3 className="text-lg font-semibold text-white">
              Delete this short link?
            </h3>
            <p className="text-sm text-gray-400 mt-1">
              This will permanently remove the short URL and its analytics. This
              action cannot be undone.
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={() => toast.dismiss(t)}
            className="px-4 py-2 rounded-xl text-sm text-gray-300 hover:bg-white/10 transition"
          >
            Cancel
          </button>

          <button
            onClick={() => {
              toast.dismiss(t);
              onConfirm();
            }}
            className="px-4 py-2 rounded-xl text-sm font-semibold bg-red-500 text-white hover:bg-red-600 transition flex items-center gap-2"
          >
            <Trash2 className="w-4 h-4" />
            Delete URL
          </button>
        </div>
      </div>
    ),
    {
      duration: Infinity,
      position: "top-right",
    },
  );
};
