import React from "react";

function About() {
  const achievements = [
    { value: "3", label: "Island Rankers", color: "text-blue-600" },
    { value: "15+", label: "District Ranks", color: "text-blue-600" },
    { value: "1000+", label: "University Entrants", color: "text-blue-600" },
  ];

  return (
    <div name="about" className="w-full my-32 bg-gray-50">
      <div className="max-w-[1240px] mx-auto px-4 py-16">
        {/* Header Section */}
        <div className="text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800">
            Best Results in the City for a Decade
          </h2>
          <p className="text-xl md:text-2xl py-6 text-gray-600 max-w-3xl mx-auto">
            Our dedicated and highly qualified teachers have consistently delivered outstanding results from 2015 to 2024, shaping the future of countless students.
          </p>
        </div>

        {/* Achievements Grid */}
        <div className="grid md:grid-cols-3 gap-6 px-2 text-center">
          {achievements.map((achievement, index) => (
            <div
              key={index}
              className="border border-gray-200 py-10 rounded-xl shadow-lg bg-white hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
            >
              <p className={`text-5xl md:text-6xl font-bold ${achievement.color}`}>
                {achievement.value}
              </p>
              <p className="text-gray-500 mt-3 text-lg">{achievement.label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default About;