export function formatSeriesInfo({ season, episode }) {
    return "S" + formatNumber(season) + "E" + formatNumber(episode);
}

export function formatNumber(value, digits = 2) {
    return String(value).padStart(digits, "0");
}

export function formatSeconds(value) {
    const seconds = value % 60;
    const minutes = Math.floor(value / 60) % 60;
    const hours = Math.floor(value / 3600) % 24;

    return [
        formatNumber(hours.toFixed(0)),
        formatNumber(minutes.toFixed(0)),
        formatNumber(seconds.toFixed(0)),
    ].join(":");
}

export function renderMeta({ season, episode, year }) {
    return (season && episode && formatSeriesInfo({ season, episode })) || year;
}
