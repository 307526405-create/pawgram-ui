import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";
import { X, ChevronLeft, ChevronRight, Check, PawPrint } from "lucide-react";
import { usersApi } from "../api/client";

const POPULAR_BREEDS = ["金毛", "柯基", "泰迪", "布偶猫", "英短", "哈士奇", "柴犬", "萨摩耶"];

const PERSONALITY_TAGS = [
  { key: "energetic", label: "活泼好动", icon: "⚡" },
  { key: "gentle", label: "温顺亲人", icon: "💕" },
  { key: "clingy", label: "粘人精", icon: "🥰" },
  { key: "independent", label: "独立高冷", icon: "😼" },
  { key: "foodie", label: "贪吃鬼", icon: "🍖" },
  { key: "shy", label: "胆小害羞", icon: "🙈" },
  { key: "curious", label: "好奇宝宝", icon: "🔍" },
  { key: "lazy", label: "佛系懒宅", icon: "😴" },
  { key: "friendly", label: "社交达人", icon: "🤝" },
  { key: "smart", label: "聪明机灵", icon: "🧠" },
  { key: "playful", label: "爱玩好动", icon: "🎾" },
  { key: "quiet", label: "安静乖巧", icon: "🤫" },
];

const AGE_OPTIONS = [
  { value: "幼年(0-1岁)", labelKey: "petOnboarding.agePuppy" },
  { value: "青年(1-3岁)", labelKey: "petOnboarding.ageYoung" },
  { value: "成年(3-7岁)", labelKey: "petOnboarding.ageAdult" },
  { value: "老年(7岁+)", labelKey: "petOnboarding.ageSenior" },
];

type Step = 1 | 2 | 3 | 4;

interface Props {
  onClose: () => void;
}

export function PetOnboarding({ onClose }: Props) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>(1);
  const [petName, setPetName] = useState("");
  const [breed, setBreed] = useState("");
  const [age, setAge] = useState("");
  const [personalities, setPersonalities] = useState<Set<string>>(new Set());
  const [saving, setSaving] = useState(false);

  const allBreeds = Object.keys(t("pet.breeds", { returnObjects: true }) as Record<string, string>);
  const otherBreeds = allBreeds.filter((b) => !POPULAR_BREEDS.includes(b));

  const togglePersonality = (key: string) => {
    setPersonalities((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  const canNext = () => {
    if (step === 1) return petName.trim() !== "" && breed !== "";
    if (step === 2) return age !== "";
    if (step === 3) return personalities.size > 0;
    return false;
  };

  const handleNext = () => {
    if (step < 3) setStep((s) => (s + 1) as Step);
    else if (step === 3) setStep(4);
  };

  const handleDone = async () => {
    setSaving(true);
    try {
      await usersApi.update(1, {
        pet_name: petName.trim(),
        pet_breed: breed,
        pet_age: age,
        pet_personality: Array.from(personalities).join(","),
      });
    } catch {}
    localStorage.setItem("pawgram_pet_created", "1");
    onClose();
    navigate(`/breed/${encodeURIComponent(breed)}`);
  };

  const ageLabel = AGE_OPTIONS.find((o) => o.value === age)?.labelKey
    ? t(AGE_OPTIONS.find((o) => o.value === age)!.labelKey)
    : age;

  return (
    <div className="fixed inset-0 z-[100] bg-black/50 flex items-end sm:items-center sm:justify-center">
      <div className="w-full sm:max-w-md bg-white dark:bg-gray-900 rounded-t-[20px] sm:rounded-2xl max-h-[85vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-5 pt-5 pb-3 shrink-0">
          <button onClick={onClose} className="p-1 -ml-1">
            <X className="w-5 h-5 text-[#999] dark:text-gray-400" />
          </button>
          <h2 className="text-[17px] font-bold text-[#333] dark:text-gray-100">
            {t("petOnboarding.title")}
          </h2>
          <div className="w-7" />
        </div>

        {/* Step indicator */}
        <div className="flex items-center gap-1.5 px-5 mb-4 shrink-0">
          {[1, 2, 3, 4].map((s) => (
            <div key={s} className="flex-1">
              <div
                className={`h-1.5 rounded-full transition-colors ${
                  s <= step ? "bg-[#FF8C42]" : "bg-[#E5E5E5] dark:bg-gray-700"
                }`}
              />
            </div>
          ))}
        </div>

        {/* Step content */}
        <div className="flex-1 overflow-y-auto px-5 pb-5">
          {/* Step 1: Pet Name + Breed */}
          {step === 1 && (
            <div>
              <p className="text-[14px] text-[#666] dark:text-gray-400 mb-3">
                {t("petOnboarding.stepBreed")}
              </p>

              <label className="block text-[13px] font-medium text-[#333] dark:text-gray-200 mb-1.5">
                {t("petOnboarding.petNameLabel")}
              </label>
              <input
                type="text"
                value={petName}
                onChange={(e) => setPetName(e.target.value)}
                placeholder={t("petOnboarding.petNamePlaceholder")}
                maxLength={20}
                className="w-full px-4 py-3 rounded-xl bg-[#F5F5F5] dark:bg-gray-800 text-[14px] text-[#333] dark:text-gray-100 placeholder-[#BBB] dark:placeholder-gray-400 border border-transparent focus:border-[#FF8C42] focus:outline-none mb-4 transition-colors"
              />

              <div className="flex flex-wrap gap-2 mb-4">
                {POPULAR_BREEDS.map((b) => (
                  <button
                    key={b}
                    onClick={() => setBreed(b)}
                    className={`px-3.5 py-2 rounded-full text-[13px] font-medium transition-colors ${
                      breed === b
                        ? "bg-[#FF8C42] text-white"
                        : "bg-[#F5F5F5] dark:bg-gray-800 text-[#666] dark:text-gray-400 active:bg-[#EBEBEB]"
                    }`}
                  >
                    {b}
                  </button>
                ))}
              </div>
              {otherBreeds.length > 0 && (
                <>
                  <p className="text-[12px] text-[#BBB] dark:text-gray-400 mb-2">
                    更多品种
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {otherBreeds.map((b) => (
                      <button
                        key={b}
                        onClick={() => setBreed(b)}
                        className={`px-3 py-1.5 rounded-full text-[12px] transition-colors ${
                          breed === b
                            ? "bg-[#FF8C42] text-white"
                            : "bg-[#F5F5F5] dark:bg-gray-800 text-[#999] dark:text-gray-400 active:bg-[#EBEBEB]"
                        }`}
                      >
                        {b}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          )}

          {/* Step 2: Age */}
          {step === 2 && (
            <div>
              <p className="text-[14px] text-[#666] dark:text-gray-400 mb-3">
                {t("petOnboarding.stepAge")}
              </p>
              <div className="space-y-2">
                {AGE_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => setAge(opt.value)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-[14px] font-medium transition-colors ${
                      age === opt.value
                        ? "bg-[#FFF3E6] dark:bg-orange-900/20 border border-[#FF8C42] text-[#FF8C42]"
                        : "bg-[#F5F5F5] dark:bg-gray-800 border border-transparent text-[#666] dark:text-gray-400"
                    }`}
                  >
                    <span className="flex-1 text-left">{t(opt.labelKey)}</span>
                    {age === opt.value && (
                      <Check className="w-4 h-4 shrink-0" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 3: Personality */}
          {step === 3 && (
            <div>
              <p className="text-[14px] text-[#666] dark:text-gray-400 mb-3">
                {t("petOnboarding.stepPersonality")}（多选）
              </p>
              <div className="flex flex-wrap gap-2">
                {PERSONALITY_TAGS.map((tag) => (
                  <button
                    key={tag.key}
                    onClick={() => togglePersonality(tag.key)}
                    className={`flex items-center gap-1.5 px-3.5 py-2 rounded-full text-[13px] font-medium transition-colors ${
                      personalities.has(tag.key)
                        ? "bg-[#FFF3E6] dark:bg-orange-900/20 border border-[#FF8C42] text-[#FF8C42]"
                        : "bg-[#F5F5F5] dark:bg-gray-800 border border-transparent text-[#666] dark:text-gray-400 active:bg-[#EBEBEB]"
                    }`}
                  >
                    <span>{tag.icon}</span>
                    <span>{tag.label}</span>
                    {personalities.has(tag.key) && (
                      <Check className="w-3.5 h-3.5 shrink-0" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 4: Confirmation */}
          {step === 4 && (
            <div className="flex flex-col items-center text-center py-6">
              <div className="w-20 h-20 rounded-full bg-[#FFF3E6] dark:bg-orange-900/20 flex items-center justify-center mb-4">
                <PawPrint className="w-10 h-10 text-[#FF8C42]" />
              </div>
              <h3 className="text-[17px] font-bold text-[#333] dark:text-gray-100 mb-2">
                {t("petOnboarding.stepDone")}
              </h3>
              <div className="space-y-2 w-full mt-3">
                <div className="flex items-center justify-between px-4 py-2.5 bg-[#F8F8F8] dark:bg-gray-800 rounded-xl">
                  <span className="text-[13px] text-[#999] dark:text-gray-400">
                    {t("petOnboarding.petNameLabel")}
                  </span>
                  <span className="text-[14px] font-semibold text-[#333] dark:text-gray-100">
                    {petName}
                  </span>
                </div>
                <div className="flex items-center justify-between px-4 py-2.5 bg-[#F8F8F8] dark:bg-gray-800 rounded-xl">
                  <span className="text-[13px] text-[#999] dark:text-gray-400">
                    {t("petOnboarding.stepBreed")}
                  </span>
                  <span className="text-[14px] font-semibold text-[#333] dark:text-gray-100">
                    {breed}
                  </span>
                </div>
                <div className="flex items-center justify-between px-4 py-2.5 bg-[#F8F8F8] dark:bg-gray-800 rounded-xl">
                  <span className="text-[13px] text-[#999] dark:text-gray-400">
                    {t("petOnboarding.stepAge")}
                  </span>
                  <span className="text-[14px] font-semibold text-[#333] dark:text-gray-100">
                    {ageLabel}
                  </span>
                </div>
                <div className="flex items-start justify-between px-4 py-2.5 bg-[#F8F8F8] dark:bg-gray-800 rounded-xl">
                  <span className="text-[13px] text-[#999] dark:text-gray-400 shrink-0 mr-3">
                    {t("petOnboarding.stepPersonality")}
                  </span>
                  <span className="text-[14px] font-semibold text-[#333] dark:text-gray-100 text-right">
                    {Array.from(personalities)
                      .map((k) => PERSONALITY_TAGS.find((t) => t.key === k)?.label)
                      .join(" · ")}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Bottom buttons */}
        <div className="flex items-center gap-3 px-5 pb-8 pt-2 shrink-0">
          {step > 1 && step < 4 && (
            <button
              onClick={() => setStep((s) => (s - 1) as Step)}
              className="flex items-center justify-center gap-1 w-24 h-11 rounded-full bg-[#F5F5F5] dark:bg-gray-800 text-[14px] font-medium text-[#666] dark:text-gray-400 active:bg-[#EBEBEB]"
            >
              <ChevronLeft className="w-4 h-4" />
              {t("petOnboarding.prev")}
            </button>
          )}
          {step < 3 ? (
            <button
              onClick={handleNext}
              disabled={!canNext()}
              className={`flex-1 flex items-center justify-center gap-1 h-11 rounded-full text-[14px] font-bold transition-colors ${
                canNext()
                  ? "bg-[#FF8C42] text-white active:bg-[#E67A35]"
                  : "bg-[#E5E5E5] dark:bg-gray-700 text-[#BBB] dark:text-gray-400"
              }`}
            >
              {t("petOnboarding.next")}
              <ChevronRight className="w-4 h-4" />
            </button>
          ) : step === 3 ? (
            <button
              onClick={handleNext}
              disabled={!canNext()}
              className={`flex-1 flex items-center justify-center gap-1 h-11 rounded-full text-[14px] font-bold transition-colors ${
                canNext()
                  ? "bg-[#FF8C42] text-white active:bg-[#E67A35]"
                  : "bg-[#E5E5E5] dark:bg-gray-700 text-[#BBB] dark:text-gray-400"
              }`}
            >
              {t("petOnboarding.next")}
              <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={handleDone}
              disabled={saving}
              className={`flex-1 flex items-center justify-center h-11 rounded-full text-[14px] font-bold transition-colors ${
                !saving
                  ? "bg-[#FF8C42] text-white active:bg-[#E67A35]"
                  : "bg-[#E5E5E5] dark:bg-gray-700 text-[#BBB] dark:text-gray-400"
              }`}
            >
              {saving ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  {t("petOnboarding.saving")}
                </span>
              ) : (
                t("petOnboarding.done")
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default PetOnboarding;
