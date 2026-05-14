var config = {
    content: ["./index.html", "./src/**/*.{ts,tsx}"],
    theme: {
        extend: {
            fontFamily: {
                sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
                heading: ["Manrope", "Inter", "ui-sans-serif", "system-ui", "sans-serif"],
                display: ["Playfair Display", "Manrope", "serif"]
            },
            colors: {
                luxury: {
                    bg: "#030303",
                    secondary: "#080808",
                    text: "#f5f5f0",
                    muted: "#9b9b91",
                    accent: "#d7b46a",
                    accentHover: "#f0cf84",
                    darkButton: "rgba(255,255,255,0.04)"
                }
            },
            boxShadow: {
                "soft-glow": "0 0 28px rgba(215, 180, 106, 0.16)",
                luxury: "0 24px 80px rgba(0, 0, 0, 0.55), 0 0 42px rgba(215, 180, 106, 0.12)"
            },
            backgroundImage: {
                "void-grid": "linear-gradient(rgba(215,180,106,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(215,180,106,0.04) 1px, transparent 1px)"
            },
            keyframes: {
                gradientShift: {
                    "0%, 100%": { backgroundPosition: "0% 50%" },
                    "50%": { backgroundPosition: "100% 50%" }
                },
                float: {
                    "0%, 100%": { transform: "translateY(0)" },
                    "50%": { transform: "translateY(-10px)" }
                },
                softPulse: {
                    "0%, 100%": { opacity: "0.56", transform: "scale(1)" },
                    "50%": { opacity: "0.82", transform: "scale(1.03)" }
                }
            },
            animation: {
                gradient: "gradientShift 12s ease infinite",
                float: "float 6s ease-in-out infinite",
                "soft-pulse": "softPulse 4s ease-in-out infinite"
            }
        }
    },
    plugins: []
};
export default config;
