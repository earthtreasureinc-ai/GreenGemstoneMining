import type { ReactNode } from 'react';

const mineralInterests = [
  'Gold', 'Mica muscovite', 'Lithium', 'Copper', 'Tin', 'Tungsten',
  'Lead', 'Titanium', 'Tantalum', 'Uranium', 'Beryl', 'Molybdenum',
  'Chromite', 'Beryllium', 'Emerald',
];

const gemstoneInterests = [
  'Alexandrite', 'Emerald', 'Sapphire', 'Ruby', 'Aquamarine', 'Tsavorite',
  'Serendibite', 'Spinel', 'Opal', 'Topaz', 'Tourmaline',
];

function Card({ label, title, children }: { label: string; title: string; children: ReactNode }) {
  return <article className="content-card"><span className="content-label">{label}</span><h3>{title}</h3>{children}</article>;
}

export default function CompanyContent() {
  return (
    <div className="company-content">
      <section id="company-profile" className="sec">
        <div className="sec-container">
          <div className="content-intro reveal in">
            <p className="eyebrow center">Company profile</p>
            <h2 className="display">Local knowledge.<br /><em>Global opportunity.</em></h2>
            <p className="body-text">Green Gemstone Mining Company is a local mining and development company based in Hargeisa, Somaliland. Its focus includes high-grade mineral opportunities across gemstone, rare earth and industrial-metal sectors, with an emphasis on responsible development and local participation.</p>
          </div>
          <div className="content-grid">
            <Card label="Our approach" title="A diversified strategy">
              <p>The company strategy spans precious and non-precious metals, precious and non-precious gemstones, and mineral concentrates, with development opportunities across Somaliland.</p>
            </Card>
            <Card label="Our people" title="Rooted in Somaliland">
              <p>Company materials describe a diverse local workforce drawn from regions across Somaliland, with a commitment to safe and sustainable practices that create value for employees, customers, shareholders and local communities.</p>
            </Card>
            <Card label="Our responsibility" title="Safety comes first">
              <p>The company states that social and environmental responsibility, industry best practice, and the safety and well-being of its people are central to its operations.</p>
            </Card>
          </div>
        </div>
      </section>

      <section id="vision-mission" className="sec sec-dark">
        <div className="sec-container">
          <div className="content-intro reveal in">
            <p className="eyebrow center">Vision &amp; mission</p>
            <h2 className="display light">Build opportunity.<br /><em>Grow local value.</em></h2>
            <p className="body-text">The company aims to help establish Somaliland as a stronger participant in international gemstone and industrial-mineral markets while expanding local employment and processing capability.</p>
          </div>
          <div className="content-two-col">
            <Card label="Vision" title="Processing and export">
              <ul>
                <li>Process rare-earth and industrial-metal materials in Somaliland and pursue competitive international markets for finished products.</li>
                <li>Create local employment by working with miners and deposit holders, buying suitable mineral output, and developing processing capability.</li>
                <li>Grow the workforce over time; company materials set an ambition of 1,000 employees within five years, subject to growth and financing.</li>
              </ul>
            </Card>
            <Card label="Mission" title="From local connections to global markets">
              <ul>
                <li>Expand the team across Somaliland and build relationships with miners and holders of relevant mineral deposits.</li>
                <li>Develop responsible precious-gemstone, rare-earth and industrial-metal opportunities.</li>
                <li>Work toward a stronger Somaliland presence in global rare-earth and industrial-metal markets.</li>
              </ul>
            </Card>
          </div>
        </div>
      </section>

      <section id="industrial-metals" className="sec">
        <div className="sec-container">
          <div className="content-intro reveal in">
            <p className="eyebrow center">Mineral portfolio</p>
            <h2 className="display">Metals and mineral<br /><em>interests.</em></h2>
            <p className="body-text">These are mineral interests named in the company website and Canva source material. The list describes areas of interest, not independently verified reserves or a statement that every material is currently being mined.</p>
          </div>
          <div className="content-pill-list">{mineralInterests.map((name) => <span className="content-pill" key={name}>{name}</span>)}</div>
          <div className="content-note">Resource descriptions and geological occurrences should be assessed against project-specific technical information. The presence of a mineral in this catalogue is not a reserve estimate or a guarantee of commercial viability.</div>
        </div>
      </section>

      <section id="gemstones" className="sec sec-dark">
        <div className="sec-container">
          <div className="content-intro reveal in">
            <p className="eyebrow center">Gemstones</p>
            <h2 className="display light">A broad gemstone<br /><em>portfolio.</em></h2>
            <p className="body-text">The Canva source lists the following gemstone types among the company's areas of interest.</p>
          </div>
          <div className="content-grid">
            {gemstoneInterests.map((name, i) => <article className="content-card gemstone-card" key={name}><span className="content-label">Gemstone {String(i + 1).padStart(2, '0')}</span><h3>{name}</h3><p>Listed in the company's source material as a gemstone of interest.</p></article>)}
          </div>
        </div>
      </section>

      <section id="operations" className="sec">
        <div className="sec-container">
          <div className="content-intro reveal in">
            <p className="eyebrow center">Operations &amp; equipment</p>
            <h2 className="display">Real assets.<br /><em>Clear constraints.</em></h2>
            <p className="body-text">The following operational details were supplied by the company and are presented as company-reported information.</p>
          </div>
          <div className="content-grid">
            <Card label="Mining history" title="Telluride ore">
              <p>Approximately 600 tonnes of telluride ore were mined. Production stopped when funding ran short. This is telluride ore, not 600 tonnes of gold.</p>
            </Card>
            <Card label="Contracts" title="Eight major contracts">
              <p>The company reports that eight major industrial-mineral contracts have been secured.</p>
            </Card>
            <Card label="Processing plant" title="1 tonne per hour">
              <p>The company reports ownership of a gold processing plant rated at one tonne per hour, with the following equipment:</p>
              <ul>
                <li>250 × 500 hammer mill</li>
                <li>15×0×250 jaw crusher (notation preserved from the supplied specification)</li>
                <li>4-metre 6S shaking table</li>
                <li>Five sluice boxes</li>
                <li>Three centrifugal water pumps</li>
                <li>Six gold pans</li>
              </ul>
            </Card>
            <Card label="Heavy equipment" title="Volvo BL70B">
              <p>The company also reports ownership of a Volvo BL70B backhoe.</p>
            </Card>
            <Card label="Safety &amp; responsibility" title="Responsible operations">
              <p>Company materials state that safety, employee well-being and socially and environmentally responsible practices are core priorities.</p>
            </Card>
          </div>
          <div className="content-note">Equipment, output history and contract details are company-reported. Supporting documentation should be reviewed during investor due diligence.</div>
        </div>
      </section>

      <section id="development-projects" className="sec sec-dark">
        <div className="sec-container">
          <div className="content-intro reveal in">
            <p className="eyebrow center">Mining projects</p>
            <h2 className="display light">Mining development<br /><em>opportunities.</em></h2>
            <p className="body-text">The company reports more than six excavation-ready mining projects and says additional funding is needed to service its contracts and advance them. This section covers mining opportunities; the company's wider rural-development and community-support work is described separately below.</p>
          </div>
          <div className="content-grid">
            <Card label="Mining development" title="More than six projects">
              <p>Company-reported opportunities across the mining portfolio. Project names, licences and technical status are not fully specified in the source content reviewed here.</p>
            </Card>
            <Card label="Partnerships" title="Investment and technical partners">
              <p>The company is seeking investment, joint-venture partners, mineral offtake relationships, and technical or operating support.</p>
            </Card>
            <Card label="Regional focus" title="Across Somaliland">
              <p>Company materials identify Awdal, Maroodi Jeex, Sahil (also written Saaxil), Togdheer, Sanaag and Sool as regions of interest.</p>
            </Card>
          </div>
        </div>
      </section>

      <section id="rural-development" className="sec">
        <div className="sec-container">
          <div className="content-intro reveal in">
            <p className="eyebrow center">Rural development &amp; community support</p>
            <h2 className="display">Beyond the mine.<br /><em>Supporting rural life.</em></h2>
            <p className="body-text">Green Gemstone Mining Company's rural-development work is broader than mining-site development. It includes helping communities in rural areas during mining projects and geological surveying, as well as community and humanitarian support during difficult periods.</p>
          </div>
          <div className="content-grid">
            <Card label="Water &amp; access" title="Water wells and rural roads">
              <p>Community support can include helping rural communities access water and digging wells where local water sources are insufficient. The company also reports road construction connected with its mining projects:</p>
              <ul>
                <li><strong>Emerald project:</strong> approximately 2 km of road built.</li>
                <li><strong>Telluride project:</strong> approximately 3 km of road built.</li>
              </ul>
            </Card>
            <Card label="Humanitarian support" title="Help during famine and hardship">
              <p>The company describes helping rural communities during difficult times, including famine and water shortages, and helping families relocate during famine seasons when conditions require it.</p>
            </Card>
            <Card label="Community &amp; faith" title="Rural mosque restoration">
              <p>Community initiatives can include restoring rural mosques, providing prayer rugs and Quran books, supporting solar-panel installations, and helping with the hiring of additional religious teachers.</p>
            </Card>
          </div>
          <div className="content-note">The road lengths above are specific examples supplied by the company. Other activities describe the types of community support undertaken or supported; dates, locations and individual project records have not yet been supplied for publication.</div>
        </div>
      </section>

      <section id="services" className="sec">
        <div className="sec-container">
          <div className="content-intro reveal in">
            <p className="eyebrow center">Services &amp; initiatives</p>
            <h2 className="display">Beyond extraction.<br /><em>Local development.</em></h2>
            <p className="body-text">The Canva material also names service areas and community-development interests. These are shown as areas listed in the source, not as a claim that every service is currently active.</p>
          </div>
          <div className="content-grid">
            <Card label="Listed service" title="Mineral identification"><p>Mineral identification is listed among the company's service areas.</p></Card>
            <Card label="Listed service" title="Mineral processing"><p>Mineral processing is listed among the company's service areas.</p></Card>
            <Card label="Listed service" title="Agriculture"><p>Agriculture is listed as a service or development area in the Canva material.</p></Card>
            <Card label="Listed service" title="Rural development"><p>Rural development is listed as a service or development area in the Canva material.</p></Card>
            <Card label="Listed service" title="Fishing"><p>Fishing is listed as a service or development area in the Canva material.</p></Card>
            <Card label="Research initiative" title="Seaweed information gathering"><p>The company has begun gathering information about seaweed and is exploring wild collection and ocean farming as future possibilities. These are research and planning activities, not represented here as established operations.</p></Card>
          </div>
        </div>
      </section>

      <section id="history-details" className="sec sec-dark">
        <div className="sec-container">
          <div className="content-intro reveal in">
            <p className="eyebrow center">Company history</p>
            <h2 className="display light">Built through fieldwork<br /><em>and persistence.</em></h2>
            <p className="body-text">The company history supplied in Canva describes an early personal investment, geological fieldwork, mining and exploration activity, and a continued effort to attract development funding.</p>
          </div>
          <div className="content-grid">
            <Card label="Early effort" title="Initial investment"><p>The source describes an initial investment of personal life savings and the engagement of the company's first geologist.</p></Card>
            <Card label="First mining project" title="Emeralds at Dagax Madhow"><p>The first mining project is described as emerald mining in Dagax Madhow.</p></Card>
            <Card label="Persistence" title="Exploration through COVID-19"><p>The company says it continued mining and exploration despite financial challenges during the COVID-19 period.</p></Card>
            <Card label="Discovery" title="Emerald deposit"><p>The source describes reaching a high-quality emerald deposit after sustained effort and investment.</p></Card>
            <Card label="Growth" title="Plant and equipment"><p>The company reports receiving its first gold processing plant and heavy equipment as part of its development journey.</p></Card>
            <Card label="Next stage" title="Seeking development partners"><p>The company is continuing to engage potential investors to advance its projects and service its contracts.</p></Card>
          </div>
        </div>
      </section>

      <section id="leadership" className="sec">
        <div className="sec-container">
          <div className="content-intro reveal in">
            <p className="eyebrow center">Leadership</p>
            <h2 className="display">Local leadership.<br /><em>Operational focus.</em></h2>
          </div>
          <div className="content-grid">
            <Card label="Executive leadership" title="Mr. Ahmed Saleiman">
              <p>Executive Director</p>
            </Card>
            <Card label="Operations" title="Mr. Saeed Guled">
              <p>Operations Manager</p>
            </Card>
            <Card label="Head office" title="Hargeisa, Somaliland">
              <p>Omar Hashi Building, 4th Floor, Hargeisa, Somaliland.</p>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
