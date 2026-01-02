import { ReactNode, useState } from 'react';
import { ProjectData } from './components/ProjectData';
import './Navigation.css'; 
import ImageGallery from './components/ImageGallery';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';

interface ProjectLive {
    title: string;
    link: string;
    htmlSite: boolean;
}
const ProjectsLive: ProjectLive[] = [
    { title: "Simple Gear Simulation", link: 'https://dominikmat.github.io/simple-gear-calculator/', htmlSite:false},
    { title: "Arc collisions HTML", link: '/dominik-home/circle-collisions/index.html', htmlSite:true},
    { title: "Softbody Simulation HTML", link: '/dominik-home/softbody simulation/index.html', htmlSite:true},
    { title: "Gravity Simulation HTML", link: '/dominik-home/gravity simulation/index.html', htmlSite:true},
    { title: "SPH Simulation HTML", link: '/dominik-home/sph fluid simulation/index.html', htmlSite:true},
    { title: "stronka zosi HTML", link: '/dominik-home/stronka zosi/stronkaZosi.html', htmlSite:true},
]

const Navigation: React.FC = () => {
  enum Mode { Default, About, ProjectsLive, ProjectsList };
  const [currentMode, setMode] = useState<Mode>(Mode.Default);
  const [lineHeight, setLineHeight] = useState<number>(300);
  const [selectedProject, setSelectedProject] = useState<number>(0);
  
    function changeMode(newMode: Mode) {
        setMode(newMode);
        switch (newMode) {
            case Mode.Default: setLineHeight(300); break;
            case Mode.About: setLineHeight(230); break;
            case Mode.ProjectsLive: setLineHeight(ProjectsLive.length*75); break;
            case Mode.ProjectsList: setLineHeight(ProjectData.length*132.5); break;
        }
    }

  return (
    // Kontener do centrowania na ekranie
    <div className="portfolio-center-container">
      
      <div className="terminal-structure">
          <div className="top-line">
            { currentMode != Mode.Default ? 
                <button className="top-back-arrow" onClick={() => changeMode(Mode.Default)}>
                  &lt;---
                </button>
                : null
            }
          </div>
          <h1 className="name">Dominik Mat</h1>

        <div className="menu-container">

          <div className="animated-line"
            style={{ height: `${lineHeight}px` }}
          >

          </div>
          
            {/* DEFAUTL SECTION */}
            { currentMode == Mode.Default ? 
                <div className="links-wrapper">
                    <a onClick={() => changeMode(Mode.About)}>about</a>
                    <a onClick={() => changeMode(Mode.ProjectsList)}>projects</a>
                    <a onClick={() => changeMode(Mode.ProjectsLive)}>websites live</a>
                    <a href="https://github.com/DominikMat">github</a>
                    {/* <a href="/dominik-home/CV_DominikMat.pdf"> -cv-</a> */}
                </div> : null }

            {/* ABOUT SECTION */}
            { currentMode == Mode.About ? 
                <div className="about-textbox">
                    <p> hello internet! </p>
                    <p> I'm Dominik, I like </p>
                    <p> making simulations & </p>
                    <p> graphics programming :) </p>
                </div> : null }
            
            {/* PROJCETS LIVE SECTION */}
            { currentMode == Mode.ProjectsLive ? 
                    <div className='links-wrapper'>
                        {/* <BrowserRouter>
                            <nav> */}
                            {
                                ProjectsLive.map((project,i) => (
                                    <a href={project.link} 
                                        style={{animationDelay:(0.225*i).toString()+'s', 
                                            color: project.htmlSite ? '#4e4e4eff' : 'black',
                                            fontSize: project.htmlSite ? '4ch' : '6ch'
                                            }}
                                    > 
                                        {project.title} 
                                    </a>
                                ))
                            }
                            {/* </nav>
                        </BrowserRouter> */}
                    </div> : null }
            
            {/* PROJECT LIST SECTION */}
            { currentMode == Mode.ProjectsList ? 
                    <div className='project-display'>
                        <div className="project-list" >
                            {
                                ProjectData.map((project,i) => (
                                    <button className="project-card" onClick={() => setSelectedProject(i)}
                                        style={{animationDelay:(0.35*i).toString()+'s'}}>
                                        { selectedProject == i ? (
                                            <div className="project-card-with-images">
                                                <div className="project-card-selected">
                                                    <div className="project-info">

                                                        <h1> [{i+1}] {project.title} </h1>
                                                        <p> {project.description} </p>
                                                        <br/>
                                                        <p> {project.details} </p>
                                                        
                                                        { project.startDate != project.endDate ? (
                                                            <p> {project.tag.toUpperCase()} | {project.startDate} - {project.endDate} </p>
                                                        ) : (
                                                            <p> {project.tag.toUpperCase()} | {project.endDate} </p>
                                                        )}

                                                    </div>

                                                    <div > </div>

                                                    { project.links.length != 0 ? 
                                                        <div className="project-line-separator">
                                                            <div className="project-column">
                                                                <h2> Links </h2>
                                                                { project.links.map( (l,i) => (
                                                                    <a href={l.url}> {l.title} </a>
                                                                ))}
                                                            </div>
                                                        </div> : null }
                                                    { project.stats.length != 0 ? 
                                                        <div className="project-line-separator">
                                                            <div className="project-column">
                                                                <h2> Stats </h2>
                                                                { project.stats.map( (s,i) => (
                                                                    <p> {s.label} | <i>{s.value}</i> </p>
                                                                ))}
                                                            </div>
                                                        </div> : null }

                                                </div>
                                            </div>
                                        ) : (
                                            <div className="project-card-small" style={{animationDelay:(0.35*i).toString()+'s'}}>
                                                <h1> [{i+1}] {project.title} </h1>
                                                <p> {project.description} </p>
                                                
                                                { project.startDate != project.endDate ? (
                                                    <p> {project.tag.toUpperCase()} | {project.startDate} - {project.endDate} </p>
                                                ) : (
                                                    <p> {project.tag.toUpperCase()} | {project.endDate} </p>
                                                )}
                                            </div>
                                        )}
                                    </button>
                                ))
                            }
                        </div>
                        
                        <div className='project-img-gallery'>
                            <ImageGallery 
                                items={ProjectData.at(selectedProject)?.images}
                                projectTitle={ProjectData.at(selectedProject)?.title}
                                aspectMult={ProjectData.at(selectedProject)?.galleryAspectMult}
                                projectId={selectedProject}
                            />
                        </div>
                        
                    </div> : null }
        </div>
      </div>        
    </div>

  );
};

export default Navigation;