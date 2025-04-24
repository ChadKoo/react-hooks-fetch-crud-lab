import React, { useState, useEffect } from "react";

function QuestionItem({ question, onDeleteQuestion, onUpdateQuestion }) {
  const { id, prompt, answers, correctIndex } = question;

  const [selectedIndex, setSelectedIndex] = useState(correctIndex); // Controlled state for dropdown

  // Sync the local state whenever the question prop changes
  useEffect(() => {
    setSelectedIndex(correctIndex);
  }, [correctIndex]);

  function handleSelectChange(e) {
    const newCorrectIndex = parseInt(e.target.value, 10); // Ensure it's an integer
    console.log("Dropdown value changed to:", newCorrectIndex); // Debugging line

    // Update the question's correctIndex on the server
    fetch(`http://localhost:4000/questions/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ correctIndex: newCorrectIndex }),
    })
      .then((r) => r.json())
      .then((updatedQuestion) => {
        console.log("Updated question from server:", updatedQuestion); // Debugging line

        // Update the local state with the new correctIndex value
        setSelectedIndex(newCorrectIndex); // Update the dropdown selection
        onUpdateQuestion(updatedQuestion); // Update parent state with the new question
      })
      .catch((error) => console.error("Error updating question:", error));
  }

  function handleDelete() {
    fetch(`http://localhost:4000/questions/${id}`, {
      method: "DELETE",
    })
      .then(() => onDeleteQuestion(id));
  }

  const options = answers.map((answer, index) => (
    <option key={index} value={index}>
      {answer}
    </option>
  ));

  return (
    <li>
      <h4>Question {id}</h4>
      <h5>Prompt: {prompt}</h5>
      <label>
        Correct Answer:
        <select
          value={selectedIndex} // Controlled value based on local state
          onChange={handleSelectChange}
        >
          {options}
        </select>
      </label>
      <button onClick={handleDelete}>Delete Question</button>
    </li>
  );
}

export default QuestionItem;