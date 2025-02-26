export function numberToWords(num: number): string {
    const ones = ['', 'ONE', 'TWO', 'THREE', 'FOUR', 'FIVE', 'SIX', 'SEVEN', 'EIGHT', 'NINE'];
    const teens = ['TEN', 'ELEVEN', 'TWELVE', 'THIRTEEN', 'FOURTEEN', 'FIFTEEN', 'SIXTEEN', 'SEVENTEEN', 'EIGHTEEN', 'NINETEEN'];
    const tens = ['', '', 'TWENTY', 'THIRTY', 'FORTY', 'FIFTY', 'SIXTY', 'SEVENTY', 'EIGHTY', 'NINETY'];

    if (num < 10) {
        return ones[num];
    } else if (num < 20) {
        return teens[num - 10];
    } else if (num < 100) {
        return tens[Math.floor(num / 10)] + (num % 10 === 0 ? '' : ' ' + ones[num % 10]);
    } else {
        // implement hundreds, thousands, etc.
        return ones[Math.floor(num / 100)] + ' hundred' + (num % 100 === 0 ? '' : ' and ' + numberToWords(num % 100));
    }
}
