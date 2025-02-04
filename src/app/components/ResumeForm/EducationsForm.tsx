import { Form, FormSection } from "components/ResumeForm/Form";
import {
  BulletListTextarea,
  Input,
  InputDate,
} from "components/ResumeForm/Form/InputGroup";
import { BulletListIconButton } from "components/ResumeForm/Form/IconButton";
import type { CreateHandleChangeArgsWithDescriptions } from "components/ResumeForm/types";
import { useAppDispatch, useAppSelector } from "lib/redux/hooks";
import { changeEducations, selectEducations } from "lib/redux/resumeSlice";
import type { ResumeEducation } from "lib/redux/types";
import {
  changeShowBulletPoints,
  selectShowBulletPoints,
} from "lib/redux/settingsSlice";
import { useTranslation } from "react-i18next";

export const EducationsForm = () => {
  const educations = useAppSelector(selectEducations);
  const dispatch = useAppDispatch();
  const showDelete = educations.length > 1;
  const form = "educations";
  const showBulletPoints = useAppSelector(selectShowBulletPoints(form));

  const {t} = useTranslation()

  return (
    <Form form={form} addButtonText={t("add-a-note")}>
      {educations.map(({ school, degree, gpa, start_date, end_date, descriptions }, idx) => {
        const handleEducationChange = (
          ...[
            field,
            value,
          ]: CreateHandleChangeArgsWithDescriptions<ResumeEducation>
        ) => {
          dispatch(changeEducations({ idx, field, value } as any));
        };

        const handleShowBulletPoints = (value: boolean) => {
          dispatch(changeShowBulletPoints({ field: form, value }));
        };

        const showMoveUp = idx !== 0;
        const showMoveDown = idx !== educations.length - 1;

        return (
          <FormSection
            key={idx}
            form="educations"
            idx={idx}
            showMoveUp={showMoveUp}
            showMoveDown={showMoveDown}
            showDelete={showDelete}
            deleteButtonTooltipText={t("delete-a-not")}
          >
            <Input
              label={t("educational-institution")}
              labelClassName="col-span-4 max-sm:col-span-full"
              name="school"
              placeholder=""
              value={school}
              onChange={handleEducationChange}
            />
            <div className="col-span-full max-sm:col-span-full flex flex-row justify-between">
              <div className="">
                <InputDate
                  label={t("start-date")}
                  labelClassName="col-span-full max-sm:col-span-full flex-1"
                  name="start_date"
                  placeholder=""
                  value={start_date}
                  onChange={handleEducationChange}
                />
              </div>
              <div className="">
                <InputDate
                  label={t("expiration-date")}
                  labelClassName="col-span-full max-sm:col-span-full flex-1"
                  name="end_date"
                  placeholder=""
                  value={end_date}
                  onChange={handleEducationChange}
                />
              </div>
            </div>
            <Input
              label={t("degree")}
              labelClassName="col-span-4 max-sm:col-span-full"
              name="degree"
              placeholder=""
              value={degree}
              onChange={handleEducationChange}
            />
            <Input
              label={t("speciality")}
              labelClassName="col-span-2 max-sm:col-span-full"
              name="gpa"
              placeholder=""
              value={gpa}
              onChange={handleEducationChange}
            />
            <div className="relative col-span-full">
              <BulletListTextarea
                label={t("additional-information")}
                labelClassName="col-span-full"
                name="descriptions"
                placeholder=""
                value={descriptions}
                onChange={handleEducationChange}
                showBulletPoints={showBulletPoints}
              />
              <div className="absolute left-[15.6rem] top-[0.07rem]">
                <BulletListIconButton
                  showBulletPoints={showBulletPoints}
                  onClick={handleShowBulletPoints}
                />
              </div>
            </div>
          </FormSection>
        );
      })}
    </Form>
  );
};
