"use client";

import React, { ChangeEvent, useState } from "react";
import {
    Check,
    Clipboard,
    Eraser,
    Sparkles,
} from "lucide-react";
import "./reviewBuddy.css";

type MainFieldKey =
    | "admissionSummary"
    | "pmh"
    | "impressions"
    | "plan"
    | "pharmacistReview";

type SmartFieldKey = "new" | "stop" | "onHold";

type FormState = Record<MainFieldKey, string> &
    Record<SmartFieldKey, string> & {
        queries: string;
    };

const initialState: FormState = {
    admissionSummary: "",
    pmh: "",
    impressions: "",
    plan: "",
    pharmacistReview: "",
    new: "",
    stop: "",
    onHold: "",
    queries: "",
};

const mainFields: Array<{
    key: MainFieldKey;
    label: string;
    placeholder: string;
}> = [
    {
        key: "admissionSummary",
        label: "Admission Summary",
        placeholder: "",
    },
    {
        key: "pmh",
        label: "PMH",
        placeholder: "",
    },
    {
        key: "impressions",
        label: "Impressions / Problems List",
        placeholder: "",
    },
    {
        key: "plan",
        label: "Plan",
        placeholder: "",
    },
    {
        key: "pharmacistReview",
        label: "Pharmacist Review / Additional Note",
        placeholder: "",
    },
];

const medicinesFields: Array<{
    key: SmartFieldKey;
    label: string;
    placeholder: string;
}> = [
    { key: "new", label: "New", placeholder: "" },
    { key: "stop", label: "Stop", placeholder: "" },
    { key: "onHold", label: "On Hold", placeholder: "" },
];

function getSmartLines(value: string): string[] {
    return value
        .split(/\r?\n/)
        .map((line) => line.trim())
        .map((line) => line.replace(/^[-*•\d.)\s]+/, "").trim())
        .filter(Boolean);
}

function formatPlainText(state: FormState): string {
    const sections: string[] = [];

    mainFields.forEach((field) => {
        const value = state[field.key].trim();
        if (value) {
            sections.push(`${field.label}\n${value}`);
        }
    });

    const medicines = medicinesFields
        .map((field) => {
            const lines = getSmartLines(state[field.key]);
            if (!lines.length) {
                return "";
            }

            return `${field.label}\n${lines.map((line) => `- ${line}`).join("\n")}`;
        })
        .filter(Boolean)
        .join("\n\n");

    if (medicines) {
        sections.push(`Medicines Review\n${medicines}`);
    }

    const queries = getSmartLines(state.queries);
    if (queries.length) {
        sections.push(
            `Queries\n${queries.map((query, index) => `${index + 1}. ${query}`).join("\n")}`,
        );
    }

    return sections.join("\n\n");
}

function escapeHtml(value: string): string {
    return value
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

function formatHtml(state: FormState): string {
    const sections = mainFields
        .map((field) => {
            const value = state[field.key].trim();
            if (!value) {
                return "";
            }

            return `<section style="margin:0 0 18px 0;"><h2 style="font-size:18px;line-height:1.25;margin:0 0 8px 0;color:#165c63;font-weight:700;border-bottom:1px solid #b8e2dc;padding-bottom:4px;">${field.label}</h2><p style="margin:0;white-space:pre-wrap;">${escapeHtml(value)}</p></section>`;
        })
        .filter(Boolean);

    const medicines = medicinesFields
        .map((field) => {
            const lines = getSmartLines(state[field.key]);
            if (!lines.length) {
                return "";
            }

            return `<h3 style="font-size:15px;line-height:1.25;margin:12px 0 5px 0;color:#334155;font-weight:700;">${field.label}</h3><ul style="margin:0 0 10px 20px;padding:0;">${lines.map((line) => `<li>${escapeHtml(line)}</li>`).join("")}</ul>`;
        })
        .filter(Boolean)
        .join("");

    if (medicines) {
        sections.push(
            `<section style="margin:0 0 18px 0;"><h2 style="font-size:18px;line-height:1.25;margin:0 0 8px 0;color:#165c63;font-weight:700;border-bottom:1px solid #b8e2dc;padding-bottom:4px;">Medicines Review</h2>${medicines}</section>`,
        );
    }

    const queries = getSmartLines(state.queries);
    if (queries.length) {
        sections.push(
            `<section style="margin:0 0 18px 0;"><h2 style="font-size:18px;line-height:1.25;margin:0 0 8px 0;color:#165c63;font-weight:700;border-bottom:1px solid #b8e2dc;padding-bottom:4px;">Queries</h2><ol style="margin:0 0 0 20px;padding:0;">${queries.map((query) => `<li>${escapeHtml(query)}</li>`).join("")}</ol></section>`,
        );
    }

    return `<div style="font-family:Arial,Helvetica,sans-serif;font-size:12px;line-height:1.45;color:#111827;"><h1 style="font-size:22px;line-height:1.2;margin:0 0 16px 0;color:#0f3f3c;font-weight:700;">Pharmacist Review</h1>${sections.join("")}</div>`;
}

export default function ReviewBuddy() {
    const [form, setForm] = useState<FormState>(initialState);
    const [copyStatus, setCopyStatus] = useState<
        "idle" | "copiedRich" | "copiedPlain" | "empty"
    >("idle");

    const updateField =
        (field: keyof FormState) =>
        (event: ChangeEvent<HTMLTextAreaElement>) => {
            setForm((current) => ({
                ...current,
                [field]: event.target.value,
            }));
            setCopyStatus("idle");
        };

    const handleClear = () => {
        setForm(initialState);
        setCopyStatus("idle");
    };

    const handleCopyPlain = async () => {
        const plainText = formatPlainText(form);

        if (!plainText.trim()) {
            setCopyStatus("empty");
            return;
        }

        await navigator.clipboard.writeText(plainText);
        setCopyStatus("copiedPlain");
    };

    const handleCopy = async () => {
        const plainText = formatPlainText(form);

        if (!plainText.trim()) {
            setCopyStatus("empty");
            return;
        }

        const html = formatHtml(form);

        try {
            if ("ClipboardItem" in window) {
                await navigator.clipboard.write([
                    new ClipboardItem({
                        "text/html": new Blob([html], { type: "text/html" }),
                        "text/plain": new Blob([plainText], {
                            type: "text/plain",
                        }),
                    }),
                ]);
            } else {
                await navigator.clipboard.writeText(plainText);
            }

            setCopyStatus("copiedRich");
        } catch {
            await navigator.clipboard.writeText(plainText);
            setCopyStatus("copiedPlain");
        }
    };

    return (
        <main className="review-buddy container">
            <section className="review-buddy-header">
                <div>
                    <p className="review-buddy-kicker">Pharmacist review tool</p>
                    <h1 className="title is-1">Review Buddy</h1>
                </div>
                <div className="review-buddy-privacy">
                    No data is saved. Text stays in this browser tab until copied
                    or cleared.
                </div>
            </section>

            <section className="review-grid">
                {mainFields.map((field) => (
                    <div className="field review-field" key={field.key}>
                        <label className="label" htmlFor={field.key}>
                            {field.label}
                        </label>
                        <div className="control">
                            <textarea
                                id={field.key}
                                className="textarea review-textarea"
                                value={form[field.key]}
                                onChange={updateField(field.key)}
                                placeholder={field.placeholder}
                                rows={field.key === "admissionSummary" ? 5 : 4}
                            />
                        </div>
                    </div>
                ))}
            </section>

            <section className="review-section">
                <div className="review-section-title">
                    <Sparkles size={20} aria-hidden="true" />
                    <h2 className="title is-4">Medicines Changes</h2>
                </div>
                <div className="smart-grid">
                    {medicinesFields.map((field) => (
                        <div className="field smart-field" key={field.key}>
                            <label className="label" htmlFor={field.key}>
                                {field.label}
                            </label>
                            <div className="control">
                                <textarea
                                    id={field.key}
                                    className="textarea smart-textarea"
                                    value={form[field.key]}
                                    onChange={updateField(field.key)}
                                    placeholder={field.placeholder}
                                    rows={4}
                            />
                        </div>
                        </div>
                    ))}
                </div>
            </section>

            <section className="review-section">
                <div className="review-section-title">
                    <Sparkles size={20} aria-hidden="true" />
                    <h2 className="title is-4">Queries</h2>
                </div>
                <div className="field">
                    <label className="label" htmlFor="queries">
                        Query List
                    </label>
                    <div className="control">
                        <textarea
                            id="queries"
                            className="textarea review-textarea"
                            value={form.queries}
                            onChange={updateField("queries")}
                            placeholder=""
                            rows={5}
                        />
                    </div>
                </div>
            </section>

            <div className="review-actions">
                <p className="copy-status" aria-live="polite">
                    {copyStatus === "copiedRich" && "Copied formatted review."}
                    {copyStatus === "copiedPlain" && "Copied plain text review."}
                    {copyStatus === "empty" && "Add some review text first."}
                </p>
                <button className="button is-light" type="button" onClick={handleClear}>
                    <Eraser size={18} aria-hidden="true" />
                    <span>Clear</span>
                </button>
                <button
                    className="button is-info is-light"
                    type="button"
                    onClick={handleCopyPlain}
                >
                    <Clipboard size={18} aria-hidden="true" />
                    <span>Copy Plain</span>
                </button>
                <button
                    className="button is-primary"
                    type="button"
                    onClick={handleCopy}
                >
                    {copyStatus === "copiedRich" ? (
                        <Check size={18} aria-hidden="true" />
                    ) : (
                        <Clipboard size={18} aria-hidden="true" />
                    )}
                    <span>Copy</span>
                </button>
            </div>
        </main>
    );
}
