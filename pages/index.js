import { useState } from "react";
import axios from "axios";
import { FaQuestionCircle } from "react-icons/fa";
import { Toaster, toast } from "sonner";

export default function Home() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [email, setEmail] = useState({ recipient: "", subject: "", body: "" });
  const [loading, setLoading] = useState(false);

  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  const askQuestion = async () => {
    try {
      const res = await axios.post(`${API_URL}/chat`, { question });
      setAnswer(res.data.answer);
    } catch (error) {
      console.error("Error asking question:", error);
      setAnswer("Failed to get response. Please try again.");
    }
  };

  const sendEmail = async () => {
    setLoading(true);
    try {
      const res = await axios.post(
        `${API_URL}/send-email`,
        email
      );
      toast.success(res.data.message || "Email sent successfully!");

      // Clear the form after successful send
      setEmail({ recipient: "", subject: "", body: "" });
    } catch (err) {
      console.error("Error sending email:", err);
      toast.error("Failed to send email.");
    }
    setLoading(false);
  };

  const handleSampleQuestion = (sampleQuestion) => {
    setQuestion(sampleQuestion);
    // Use a timeout to ensure state is updated before making the request
    setTimeout(askQuestion, 100);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#232526] to-[#414345] flex items-center justify-center font-sans relative overflow-hidden p-4">
      {/* Decorative background shapes */}
      <div
        className="absolute -top-20 -left-20 w-[220px] h-[220px] rounded-full z-0 opacity-25"
        style={{
          background: "radial-gradient(circle, #36d1c4 0%, transparent 70%)",
        }}
      />
      <div
        className="absolute -bottom-24 -right-24 w-[260px] h-[260px] rounded-full z-0 opacity-20"
        style={{
          background: "radial-gradient(circle, #ff0080 0%, transparent 70%)",
        }}
      />

      <div className="bg-[#1e1e1ee0] rounded-3xl shadow-2xl px-6 py-8 md:px-8 md:py-10 max-w-5xl w-full text-white text-center relative z-10 transition-shadow">
        <h1 className="text-2xl md:text-3xl font-extrabold mb-2 tracking-wide drop-shadow-lg">
          MCP Playground
        </h1>
        <p className="text-base md:text-lg text-gray-300 mb-6 md:mb-8 font-medium">
          Chat with Resume &amp; Send Email
        </p>

        <div className="flex flex-col lg:flex-row gap-6 md:gap-8 justify-center items-start">
          {/* Ask Questions Section */}
          <div className="w-full lg:flex-1 bg-[#282828fa] rounded-2xl shadow-lg p-5 md:p-6">
            <label
              htmlFor="chat"
              className="text-base font-semibold block mb-2"
            >
              Ask a question
            </label>
            <div className="relative mb-3">
              <FaQuestionCircle className="absolute left-3 top-3 text-[#36d1c4] text-lg opacity-80" />
              <input
                id="chat"
                type="text"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="Type your question..."
                className="w-full pl-9 pr-4 py-3 rounded-lg border-none bg-[#222] text-white text-base outline-none shadow-md transition-shadow focus:ring-2 focus:ring-[#36d1c4]"
                onKeyPress={(e) => e.key === "Enter" && askQuestion()}
              />
            </div>
            <button
              onClick={askQuestion}
              className="w-full py-3 rounded-lg border-none bg-gradient-to-r from-[#ff8c00] to-[#ff0080] text-white font-semibold text-base md:text-lg cursor-pointer shadow-md transition-colors mb-3 hover:from-[#ff0080] hover:to-[#ff8c00]"
            >
              Send Question
            </button>

            <div className="mb-3">
              <p className="text-sm text-gray-400 mb-2">
                Try these sample questions:
              </p>
              <div className="flex flex-wrap gap-2 justify-center">
                {[
                  "What are the candidate's skills?",
                  "What is the candidate's work experience?",
                  "What is the candidate's education background?",
                  "List the candidate's certifications.",
                  "What is the candidate's email address?",
                  "What was the last position?",
                ].map((sample, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSampleQuestion(sample)}
                    className="bg-gradient-to-r from-[#36d1c4] to-[#5b86e5] text-white border-none rounded-lg px-3 py-1.5 text-xs font-medium cursor-pointer shadow transition-colors hover:from-[#5b86e5] hover:to-[#36d1c4]"
                  >
                    {sample.length > 30
                      ? `${sample.substring(0, 30)}...`
                      : sample}
                  </button>
                ))}
              </div>
            </div>

            {answer && (
              <div className="mt-4 p-3 bg-[#222] rounded-lg">
                <p className="text-sm text-gray-400 mb-1">Answer:</p>
                <div className="text-base text-[#36d1c4]">{answer}</div>
              </div>
            )}
          </div>

          {/* Send Email Section */}
          <div className="w-full lg:flex-1 bg-[#282828fa] rounded-2xl shadow-lg p-5 md:p-6">
            <label
              htmlFor="email"
              className="text-base font-semibold block mb-2"
            >
              Send Email
            </label>

            <input
              id="email"
              type="email"
              value={email.recipient}
              onChange={(e) =>
                setEmail({ ...email, recipient: e.target.value })
              }
              placeholder="Recipient's email"
              className="w-full px-4 py-3 rounded-lg border-none bg-[#222] text-white text-base mb-3 outline-none shadow-md focus:ring-2 focus:ring-[#36d1c4]"
            />

            <input
              type="text"
              value={email.subject}
              onChange={(e) => setEmail({ ...email, subject: e.target.value })}
              placeholder="Subject"
              className="w-full px-4 py-3 rounded-lg border-none bg-[#222] text-white text-base mb-3 outline-none shadow-md focus:ring-2 focus:ring-[#36d1c4]"
            />

            <textarea
              value={email.body}
              onChange={(e) => setEmail({ ...email, body: e.target.value })}
              placeholder="Your message..."
              rows={4}
              className="w-full px-4 py-3 rounded-lg border-none bg-[#222] text-white text-base mb-4 outline-none shadow-md resize-vertical focus:ring-2 focus:ring-[#36d1c4]"
            />

            <button
              onClick={sendEmail}
              disabled={
                loading || !email.recipient || !email.subject || !email.body
              }
              className={`w-full py-3 rounded-lg border-none bg-gradient-to-r from-[#36d1c4] to-[#5b86e5] text-white font-semibold text-base md:text-lg cursor-pointer shadow-md transition-colors hover:from-[#5b86e5] hover:to-[#36d1c4] flex items-center justify-center ${
                loading || !email.recipient || !email.subject || !email.body
                  ? "opacity-60 cursor-not-allowed"
                  : ""
              }`}
            >
              {loading ? (
                <>
                  <svg
                    className="animate-spin h-5 w-5 mr-2 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                    ></path>
                  </svg>
                  Sending...
                </>
              ) : (
                "Send Email"
              )}
            </button>
          </div>
        </div>
      </div>

      <Toaster
        richColors
        position="top-center"
        duration={2200}
        visibleToasts={3}
        closeButton
      />
    </div>
  );
}
