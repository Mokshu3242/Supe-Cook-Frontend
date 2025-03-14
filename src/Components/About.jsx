import { useState, useRef } from "react";
import emailjs from "emailjs-com";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const About = () => {
  const form = useRef();
  const [isSending, setIsSending] = useState(false); // State to manage cooldown

  const sendEmail = (e) => {
    e.preventDefault();

    if (isSending) {
      toast.warning("Please wait 10 seconds before sending again.", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      return;
    }

    setIsSending(true); // Disable sending
    emailjs
      .sendForm(
        "service_njv9fw9",
        "template_fr8xwfp",
        form.current,
        "tCHvymddHLxbUPmdw"
      )
      .then(
        () => {
          toast.success("Message sent successfully!", {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
          });

          setTimeout(() => {
            setIsSending(false); // Reset sending state
          }, 10000); // 10 seconds delay
        },
        () => {
          toast.error("Failed to send message.", {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
          });
          setIsSending(false); // Reset sending state if failed
        }
      );

    // Reset the form after sending
    e.target.reset();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 text-gray-900 p-4 sm:p-8">
      <div className="max-w-5xl w-full space-y-12">
        {/* Header Section */}
        <header className="text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6">
            About Us
          </h1>
          <p className="text-base sm:text-lg md:text-xl leading-relaxed max-w-2xl mx-auto">
            SupeCook is your kitchen helper, inspired by{" "}
            <a
              href="https://www.supercook.com/#/desktop"
              target="_blank" // Opens the link in a new tab
              rel="noopener noreferrer" // Security best practice for external links
              className="underline"
            >
              SuperCook
            </a>
            , but with added features to make cooking even easier.
          </p>
        </header>

        {/* Story Section */}
        <section className="text-center">
          <h2 className="text-2xl sm:text-3xl font-semibold mb-4">Our Story</h2>
          <p className="text-base sm:text-lg leading-relaxed max-w-3xl mx-auto">
            Founded in 2025, SupeCook aims to change how you cook at home by
            using smart design and new ideas.
          </p>
        </section>

        {/* Mission Section */}
        <section className="text-center">
          <h2 className="text-2xl sm:text-3xl font-semibold mb-4">
            Our Mission
          </h2>
          <p className="text-base sm:text-lg leading-relaxed max-w-3xl mx-auto">
            We want to create simple and smart tools that make cooking and using
            technology in the kitchen easy and fun.
          </p>
        </section>

        {/* Vision Section */}
        <section className="text-center">
          <h2 className="text-2xl sm:text-3xl font-semibold mb-4">
            Our Vision
          </h2>
          <p className="text-base sm:text-lg leading-relaxed max-w-3xl mx-auto">
            We see a future where technology fits smoothly into your daily life,
            helping you cook efficiently and creatively.
          </p>
        </section>

        {/* Core Values Section */}
        <section className="text-center">
          <h2 className="text-2xl sm:text-3xl font-semibold mb-4">
            Our Core Values
          </h2>
          <ul className="text-base sm:text-lg leading-relaxed list-disc list-inside space-y-2 max-w-3xl mx-auto">
            <li>
              <strong>Innovation:</strong> Always finding new ways to improve.
            </li>
            <li>
              <strong>Integrity:</strong> Being honest and clear in everything
              we do.
            </li>
            <li>
              <strong>Customer Focus:</strong> Making sure our users have the
              best experience.
            </li>
            <li>
              <strong>Collaboration:</strong> Working together to achieve great
              results.
            </li>
          </ul>
        </section>

        {/* Why Choose SupeCook Section */}
        <section className="text-center">
          <h2 className="text-2xl sm:text-3xl font-semibold mb-4">
            Why Choose SupeCook?
          </h2>
          <ul className="text-base sm:text-lg leading-relaxed list-disc list-inside space-y-2 max-w-3xl mx-auto">
            <li>
              Smart Ingredient Matching: Find recipes with the ingredients you
              already have.
            </li>
            <li>
              Reduce Food Waste: Use up what you have and throw away less.
            </li>
            <li>
              Save Time & Money: Cook with what&apos;s on hand, avoiding extra
              shopping trips.
            </li>
            <li>
              Diverse Recipe Selection: Explore a wide range of dishes for all
              tastes and diets.
            </li>
            <li>
              Easy-to-Use Interface: Navigate effortlessly to find the perfect
              meal.
            </li>
          </ul>
        </section>

        {/* Contact Section */}
        <section className="contact section py-8 sm:py-12 shadow-lg bg-gradient-to-r from-blue-50 to-indigo-50">
          <h2 className="section_title text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-6 sm:mb-8 text-indigo-700">
            Get In Touch
          </h2>
          <div className="contact_content max-w-lg mx-auto p-4 sm:p-8 rounded-xl">
            <form
              ref={form}
              onSubmit={sendEmail}
              className="contact_form space-y-4 sm:space-y-6"
            >
              <div className="contact_form-div">
                <label className="contact_form-tag text-base sm:text-lg text-gray-700">
                  Name:
                </label>
                <input
                  type="text"
                  name="name"
                  placeholder="Your Name"
                  className="contact_form-input w-full p-3 sm:p-4 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 shadow-sm transition-all ease-in-out duration-300"
                  required
                />
              </div>

              <div className="contact_form-div">
                <label className="contact_form-tag text-base sm:text-lg text-gray-700">
                  Email:
                </label>
                <input
                  type="email"
                  name="email"
                  placeholder="Your Email"
                  className="contact_form-input w-full p-3 sm:p-4 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 shadow-sm transition-all ease-in-out duration-300"
                  required
                />
              </div>

              <div className="contact_form-div contact_form-area">
                <label className="contact_form-tag text-base sm:text-lg text-gray-700">
                  Message:
                </label>
                <textarea
                  name="message"
                  cols="30"
                  rows="4"
                  className="contact_form-input w-full p-3 sm:p-4 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 shadow-sm transition-all ease-in-out duration-300"
                  placeholder="Write your message!"
                  required
                ></textarea>
              </div>

              {/* Hidden input to mark the form submission as from SupeCook */}
              <input type="hidden" name="website" value="SupeCook Website" />

              <button
                className="button w-full py-3 sm:py-4 px-6 sm:px-8 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-300 ease-in-out flex items-center justify-center"
                type="submit"
                disabled={isSending}
              >
                {isSending ? (
                  <>
                    <span className="mr-2">Sending...</span>
                    <svg
                      className="animate-spin inline-block w-5 h-5"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                    >
                      <path
                        d="M12 2v4l3-3-3-3zm0 16v4l-3-3 3-3zm0-8V6l-3 3 3 3z"
                        fill="currentColor"
                      />
                    </svg>
                  </>
                ) : (
                  "Send Message"
                )}
              </button>
            </form>
          </div>
          {/* Toast container to show notifications */}
          <ToastContainer />
        </section>
      </div>
    </div>
  );
};

export default About;
