interface TaperLabelsProps {
    taperLines: { dose: number; taperAmount: number; interval: number }[];
}

const TaperLabels: React.FC<TaperLabelsProps> = ({ taperLines }) => {
    const labels = taperLines.map((taperLine, index) => {
        let currentDose = taperLine.dose;
        const taperAmount = taperLine.taperAmount;
        const interval = taperLine.interval;

        const instructions = [];
        while (currentDose >= taperAmount) {
            instructions.push(`Take ${currentDose}mg for ${interval} days`);
            currentDose -= taperAmount;
        }

        return (
            <div key={index}>
                {instructions.map((instruction, index) => (
                    <p key={index}>{instruction}</p>
                ))}
            </div>
        );
    });

    return <div>{labels}</div>;
};

export default TaperLabels;