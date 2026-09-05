type SourceCardProps = {
    title: string;
    description: string;
};

function SourceCard({ title, description }: SourceCardProps) {
    return (
        <div className="mt-3 rounded-lg border border-slate-200 bg-slate-50 p-3 transition-colors duration-150 dark:border-slate-800 dark:bg-slate-950/70">
            <div className="flex items-start gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white text-sm shadow-xs dark:bg-slate-800">
                    📄
                </div>

                <div className="min-w-0">
                    <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                        {title}
                    </p>

                    <p className="mt-1 text-xs leading-5 text-slate-500 dark:text-slate-400">
                        {description}
                    </p>
                </div>
            </div>
        </div>
    );
}

export default SourceCard;