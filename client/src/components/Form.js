import React, { useState } from "react";
import { nanoid } from "nanoid";
import { getDatabase, child, ref, set, get } from "firebase/database";
import { isWebUri } from "valid-url";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";

const Form = () => {
	const [longURL, setLongURL] = useState("");
	const [preferredAlias, setPreferredAlias] = useState("");
	const [generatedURL, setGeneratedURL] = useState("");
	const [loading, setLoading] = useState(false);
	const [errors, setErrors] = useState([]);
	const [errorMessages, setErrorMessages] = useState({});
	const [toolTipMessage, setToolTipMessage] = useState("Copy To Clip Board");

	// When user clicks submit, this will be called
	const handleSubmit = async (e) => {
		e.preventDefault(); // Prevents page from loading, when form is submitted
		setLoading(true);
		setGeneratedURL("");

		// Validate the inpute the user has submitted
		const isFormValid = await validateInput();
		if (!isFormValid) {
			return;
		}
		// If user has preferred alias use that as a prefix, otherwise we generate one
		var newUrl = "linkcompressor-a2c6a3a79786.herokuapp.com/";
		var prefix = "";

		if (preferredAlias !== "") {
			prefix = preferredAlias;
		} else {
			prefix = nanoid(5);
		}
		newUrl = newUrl + prefix;
		// Save new compressed URL to DB
		saveToDB(prefix, longURL, preferredAlias, newUrl);
	};

	const saveToDB = (prefix, longURL, preferredAlias, newUrl) => {
		const db = getDatabase();

		set(ref(db, "/" + prefix), {
			prefix: prefix,
			longURL: longURL,
			preferredAlias: preferredAlias,
			generatedURL: newUrl,
		})
			.then((res) => {
				setGeneratedURL(newUrl);
				setLoading(false);
			})
			.catch((e) => {
				// Handle error
				hasError(e);
			});
	};

	// Check if field has an erro
	const hasError = (key) => {
		return errors.indexOf(key) !== -1;
	};

	const validateInput = async () => {
		const currentErrors = [];
		const currentErrorMessages = errorMessages;

		// Validate Long URL
		if (longURL.length === 0) {
			currentErrors.push("longURL");
			currentErrorMessages.longURL = "Please enter your URL!";
		} else if (!isWebUri(longURL)) {
			currentErrors.push("longURL");
			currentErrorMessages.longURL =
				"Please give a URL in the form of https://www....";
		}

		// Preferred ALias
		if (preferredAlias !== "") {
			if (preferredAlias.length > 7) {
				currentErrors.push("suggestedAlias");
				currentErrorMessages.suggestedAlias =
					"Please enter an alias less than 7 characters";
			} else if (preferredAlias.indexOf(" ") >= 0) {
				currentErrors.push("suggestedAlias");
				currentErrorMessages.suggestedAlias = "Spaces are not allowed in URLs";
			}

			const keyExists = await checkKeyExists();
			if (keyExists.exists()) {
				currentErrors.push("suggestedAlias");
				currentErrorMessages.suggestedAlias =
					"The alias you have entered already exists";
			}
		}

		setErrors(currentErrors);
		setErrorMessages(currentErrorMessages);
		setLoading(false);

		if (currentErrors.length > 0) {
			console.log("failed");
			return false;
		}

		return true;
	};

	const checkKeyExists = async () => {
		const dbRef = ref(getDatabase());
		return get(child(dbRef, `/${preferredAlias}`)).catch((error) => {
			return false;
		});
	};

	const copyToClipBoard = () => {
		navigator.clipboard.writeText(generatedURL);
		setToolTipMessage("Copied");
	};

	return (
		<div className="container">
			<form autoComplete="off" onSubmit={handleSubmit}>
				<h3>Link Compressor</h3>
				<div className="form-group">
					<label>Enter Your URL</label>
					<input
						id="longURL"
						value={longURL}
						type="url"
						onChange={(e) => setLongURL(e.target.value)}
						placeholder="https://www..."
						className={
							hasError("longURL") ? "form-control is-invalid" : "form-control"
						}
					/>
				</div>
				<div
					className={hasError("longURL") ? "text-danger" : "visually-hidden"}
				>
					{errorMessages.longURL}
				</div>
				<div className="form-group">
					<label htmlFor="basic-url">Your Compressed Link</label>
					<div className="input-group mb-3">
						<div className="input-group-prepend">
							<span className="input-group-text">
								linkcompressor-a2c6a3a79786.herokuapp.com/
							</span>
						</div>
						<input
							id="preferredAlias"
							value={preferredAlias}
							type="text"
							placeholder="eg. tx3fsa (Optional)"
							className={
								hasError("suggestedAlias")
									? "form-control is-invalid"
									: "form-control"
							}
							onChange={(e) => setPreferredAlias(e.target.value)}
						/>
					</div>
				</div>
				<div
					className={
						hasError("suggestedAlias") ? "text-danger" : "visually-hidden"
					}
				>
					{errorMessages.suggestedAlias}
				</div>

				<button className="btn btn-primary" type="button submit">
					{loading ? (
						<div>
							<span
								className="spinner-border spinner-border-sm"
								role="status"
								aria-hidden="true"
							></span>
						</div>
					) : (
						<div>
							<span
								className="visually-hidden spinner-border spinner-border-sm"
								role="status"
								aria-hidden="true"
							></span>
							<span>Convert</span>
						</div>
					)}
				</button>

				{generatedURL === "" ? (
					<div></div>
				) : (
					<div className="generatedurl">
						<span>Your generated URL is: </span>
						<div className="input-group mb-3">
							<input
								disabled
								type="text"
								value={generatedURL}
								className="form-control"
								placeholder="Recipient's username"
								aria-label="Recipient's username"
								aria-describedby="basic-addon2"
							/>
							<div className="input-group-append">
								<OverlayTrigger
									key={"top"}
									placement={"top"}
									overlay={
										<Tooltip id={`tooltip-${"top"}`}>{toolTipMessage}</Tooltip>
									}
								>
									<button
										onClick={() => copyToClipBoard()}
										data-toggle="tooltip"
										data-placement="top"
										title="Tooltip on top"
										className="btn btn-outline-secondary"
										type="button"
									>
										Copy
									</button>
								</OverlayTrigger>
							</div>
						</div>
					</div>
				)}
			</form>
		</div>
	);
};

export default Form;
