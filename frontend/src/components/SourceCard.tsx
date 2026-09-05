type SourceCardProps = {
    title: string;
    description: string;
};

function SourceCard({ title, description }: SourceCardProps) {
    return (
        <div className="mt-3 rounded-lg border border-slate-200 bg-slate-50 p-3">
            <div className="flex items-start gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white text-sm shadow-sm">
                    📄
                </div>

                <div className="min-w-0">
                    <p className="text-xs font-semibold text-slate-800">
                        {title}
                    </p>

                    <p className="mt-1 text-xs leading-5 text-slate-500">
                        {description}
                    </p>
                </div>
            </div>
        </div>
    );
}

export default SourceCard;