//hook to upscale table rows count by user screen size
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

export const useTableRows = (defaultRows, input) => {
    const [rowCount, setRowCount] = useState(false);
    const state = useSelector((state) => state.ui);

    useEffect(
        () => {
            if (!defaultRows) return;
            const calculate = async () => {
                const resolution = state.options?.screenHeight;
                const defaultRatio = 1080 / defaultRows;
                let upscale = 1
                if (resolution > 1080) {
                    const percentageUpScale = ((resolution * 100) / 1080) / 100
                    upscale = percentageUpScale * percentageUpScale > 1.2 ? 0.9 : 1
                }

                const count = Math.ceil((resolution / defaultRatio) * (upscale))
                setRowCount(count ? count : defaultRows)

            };

            calculate();
        },
        input ? input : []
    );

    return { rowCount };
};