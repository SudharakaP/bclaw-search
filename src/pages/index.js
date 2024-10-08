import * as React from "react"

const IndexPage = () => {
  const [searchTerm, setSearchTerm] = React.useState("");
  const [docs, setDocs] = React.useState([]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const url = `https://cors-anywhere.herokuapp.com/http://www.bclaws.ca/civix/search/complete/fullsearch?q=${searchTerm}&s=0&e=20&nFrag=5&lFrag=100`;
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }

    const responseBody = await response.text();
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(responseBody,'text/xml');

    // Now you can work with the parsed XML document
    const titles = xmlDoc.getElementsByTagName('CIVIX_DOCUMENT_TITLE');
    const indexIds = xmlDoc.getElementsByTagName('CIVIX_INDEX_ID');
    const documentIds = xmlDoc.getElementsByTagName('CIVIX_DOCUMENT_ID');

    let docs = [];
    for (let i = 0; i < titles.length; i++) {
      docs.push({title: titles[i].textContent, link: `http://www.bclaws.ca/civix/document/id/complete/${indexIds[i].textContent}/${documentIds[i].textContent}`});
    }
    setDocs(docs);
  };

  return (
    <main>
      <h1>
        BC Legislature Documents Search
        <br/>
        <form onSubmit={handleSubmit}>
          <input type="text" placeholder="Search.." onChange={(event) => setSearchTerm(event.target.value)}/>
          <input type="submit"/>
        </form>
        <div>
            <h2>Search Results</h2>
            <ol>
                {docs.map((doc) => <a href={doc.link} target="_blank" rel="noopener noreferrer"><li>{doc.title}</li></a>)}
            </ol>
        </div>
      </h1>
    </main>
  )
}

export default IndexPage

export const Head = () => <title>Home Page</title>
