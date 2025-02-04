import { Page, View, Document, Image, Text } from "@react-pdf/renderer";
import { styles, spacing } from "components/Resume/ResumePDF/styles";
import { ResumePDFProfile } from "components/Resume/ResumePDF/ResumePDFProfile";
import { ResumePDFWorkExperience } from "components/Resume/ResumePDF/ResumePDFWorkExperience";
import { ResumePDFEducation } from "components/Resume/ResumePDF/ResumePDFEducation";
import { ResumePDFProject } from "components/Resume/ResumePDF/ResumePDFProject";
import { ResumePDFSkills } from "components/Resume/ResumePDF/ResumePDFSkills";
import { ResumePDFCustom } from "components/Resume/ResumePDF/ResumePDFCustom";
import { DEFAULT_FONT_COLOR } from "lib/redux/settingsSlice";
import type { Settings, ShowForm } from "lib/redux/settingsSlice";
import type { Resume } from "lib/redux/types";
import { SuppressResumePDFErrorMessage } from "components/Resume/ResumePDF/common/SuppressResumePDFErrorMessage";
// import QRCodeGenerator from "./QRGenerator";
import generateContactQRCode, { ContactData, convertBase64ToBlob } from './QRGenerator';
import { useEffect, useState } from "react";
import { getContrastColor } from "./GetContrastColor";
import { ResumePDFText } from "./common";
import { THEME_RESUME } from "components/ResumeForm/ThemeForm/constants";
import { TemplateGenerator } from "./TemplateGenerator";




/**
 * Note: ResumePDF is supposed to be rendered inside PDFViewer. However,
 * PDFViewer is rendered too slow and has noticeable delay as you enter
 * the resume form, so we render it without PDFViewer to make it render
 * instantly. There are 2 drawbacks with this approach:
 * 1. Not everything works out of box if not rendered inside PDFViewer,
 *    e.g. svg doesn't work, so it takes in a isPDF flag that maps react
 *    pdf element to the correct dom element.
 * 2. It throws a lot of errors in console log, e.g. "<VIEW /> is using incorrect
 *    casing. Use PascalCase for React components, or lowercase for HTML elements."
 *    in development, causing a lot of noises. We can possibly workaround this by
 *    mapping every react pdf element to a dom element, but for now, we simply
 *    suppress these messages in <SuppressResumePDFErrorMessage />.
 *    https://github.com/diegomura/react-pdf/issues/239#issuecomment-487255027
 */
export const ResumePDF = ({
  resume,
  settings,
  _theme,
  isPDF = false,
}: {
  resume: Resume;
  _theme?: string,
  settings: Settings;
  isPDF?: boolean;
}) => {
  const { profile, workExperiences, educations, projects, skills, custom } =
    resume;
  const { name } = profile;
  const {
    fontFamily,
    fontSize,
    documentSize,
    formToHeading,
    formToShow,
    formsOrder,
    showBulletPoints,
    themeResume
  } = settings;
  const themeColor = settings.themeColor || DEFAULT_FONT_COLOR;

  const choosenThemeResume = THEME_RESUME.filter((el => el.name ===  themeResume))[0]

  const showFormsOrder = formsOrder.filter((form) => formToShow[form]);

  const formTypeToComponent: { [type in ShowForm]: () => JSX.Element } = {
    workExperiences: () => (
      <ResumePDFWorkExperience
        theme={choosenThemeResume}
        heading={formToHeading["workExperiences"]}
        workExperiences={workExperiences}
        themeColor={themeColor} />
    ),
    educations: () => (
      <ResumePDFEducation
        theme={choosenThemeResume}
        heading={formToHeading["educations"]}
        educations={educations}
        themeColor={themeColor}
        showBulletPoints={showBulletPoints["educations"]} />
    ),
    projects: () => (
      <ResumePDFProject
        theme={choosenThemeResume}
        heading={formToHeading["projects"]}
        projects={projects}
        themeColor={themeColor} />
    ),
    skills: () => (
      <ResumePDFSkills
        theme={choosenThemeResume}
        heading={formToHeading["skills"]}
        skills={skills}
        themeColor={themeColor}
        showBulletPoints={showBulletPoints["skills"]} />
    ),
    custom: () => (
      <ResumePDFCustom
        theme={choosenThemeResume}
        heading={formToHeading["custom"]}
        custom={custom}
        themeColor={themeColor}
        showBulletPoints={showBulletPoints["custom"]}
      />
    ),
  };

  let ProfileComponent = () => {
    return (
      <ResumePDFProfile
        style={styles.flexContactsRow}
        profile={profile}
        themeColor={themeColor}
        isPDF={isPDF}
      />
    )
  }


  return (
    <>
      <Document pageMode="fullScreen" pageLayout="twoPageRight" title={`${name} Resume`} author={name} producer={"OpenResume"}>
        <Page
          break={true}
          size={documentSize === "A4" ? "A4" : "LETTER"}
          style={{
            ...styles.flexCol,
            color: DEFAULT_FONT_COLOR,
            fontFamily,
            fontSize: fontSize + "pt",
          }}
        >

          <TemplateGenerator
            resume={resume}
            isPDF={isPDF}
            themeResumeName={settings.themeResume}
            themeResume={choosenThemeResume}
            formTypeToComponent={formTypeToComponent}
            showFormsOrder={showFormsOrder}
            profile={ProfileComponent}
            settings={settings}
          />
        </Page>
      </Document>
      <SuppressResumePDFErrorMessage />
    </>
  );
};
