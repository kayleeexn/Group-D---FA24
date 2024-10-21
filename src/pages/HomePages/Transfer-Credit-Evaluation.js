import React from 'react';

const TransferCreditEvaluation = ({ transferCredits, totalCredits }) => {
    const transferableCredits = transferCredits.filter(credit => credit.status === "Accepted").length;
    const progressPercentage = (transferableCredits / totalCredits) * 100;

    return (
        <div className="transfer-credit-container">
            <h2>Transfer Credit Evaluation</h2>
            <p>See how your transfer credits apply to your degree.</p>

            <table>
                <thead>
                    <tr>
                        <th>Course</th>
                        <th>Credits</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    {transferCredits.map((credit, index) => (
                        <tr key={index}>
                            <td>{credit.course}</td>
                            <td>{credit.credits}</td>
                            <td>
                                {credit.status === "Accepted" ? "✔️ Accepted" : "⚠️ Pending"}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

        </div>
    );
};

export default TransferCreditEvaluation;

