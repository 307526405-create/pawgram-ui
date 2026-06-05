import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";
import { X, ChevronLeft, ChevronRight, Check } from "lucide-react";
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

type Step = 1 | 2 | 3;

interface Props {
  onClose: () => void;
}

export function PetOnboardingModal({ onClose }: Props) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>(1);
  const [breed, setBreed] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
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
    if (step === 1) return breed !== "";
    if (step === 2) return age !== "" && gender !== "";
    if (step === 3) return personalities.size > 0;
    return false;
  };

  const handleNext = () => {
    if (step < 3) setStep((s) => (s + 1) as Step);
  };

  const handleDone = async () => {
    setSaving(true);
    try {
      await usersApi.update(1, {
        pet_name: "",
        pet_breed: breed,
        pet_age: age,
        pet_gender: gender,
        pet_personality: Array.from(personalities).join(","),
      });
      localStorage.setItem("pawgram_pet_onboarded", "1");
      onClose();
      navigate(`/breed/${encodeURIComponent(breed)}`);
    } catch {
      localStorage.setItem("pawgram_pet_onboarded", "1");
      onClose();
      navigate(`/breed/${encodeURIComponent(breed)}`);
    }
  };

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
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center gap-1.5 flex-1">
              <div
                className={`h-1.5 rounded-full flex-1 transition-colors ${
                  s <= step ? "bg-[#FF8C42]" : "bg-[#E5E5E5] dark:bg-gray-700"
                }`}
              />
            </div>
          ))}
        </div>

        {/* Step content */}
        <div className="flex-1 overflow-y-auto px-5 pb-5">
          {step === 1 && (
            <div>
              <p className="text-[14px] text-[#666] dark:text-gray-400 mb-3">
                {t("petOnboarding.stepBreed")}
              </p>
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
              <p className="text-[12px] text-[#BBB] dark:text-gray-500 mb-2">
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
                        : "bg-[#F5F5F5] dark:bg-gray-800 text-[#999] dark:text-gray-500 active:bg-[#EBEBEB]"
                    }`}
                  >
                    {b}
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 2 && (
            <div>
              <p className="text-[14px] text-[#666] dark:text-gray-400 mb-3">
                年龄阶段
              </p>
              <div className="space-y-2 mb-6">
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

              <p className="text-[14px] text-[#666] dark:text-gray-400 mb-3">
                性别
              </p>
              <div className="flex gap-3">
                {[
                  { value: "公", label: "公 ♂", icon: "♂️" },
                  { value: "母", label: "母 ♀", icon: "♀️" },
                ].map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => setGender(opt.value)}
                    className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-[15px] font-medium transition-colors ${
                      gender === opt.value
                        ? "bg-[#FFF3E6] dark:bg-orange-900/20 border border-[#FF8C42] text-[#FF8C42]"
                        : "bg-[#F5F5F5] dark:bg-gray-800 border border-transparent text-[#666] dark:text-gray-400"
                    }`}
                  >
                    <span>{opt.icon}</span>
                    <span>{opt.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 3 && (
            <div>
              <p className="text-[14px] text-[#666] dark:text-gray-400 mb-3">
                性格标签（多选）
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
        </div>

        {/* Bottom buttons */}
        <div className="flex items-center gap-3 px-5 pb-8 pt-2 shrink-0">
          {step > 1 && (
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
                  : "bg-[#E5E5E5] dark:bg-gray-700 text-[#BBB] dark:text-gray-500"
              }`}
            >
              {t("petOnboarding.next")}
              <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={handleDone}
              disabled={!canNext() || saving}
              className={`flex-1 flex items-center justify-center h-11 rounded-full text-[14px] font-bold transition-colors ${
                canNext() && !saving
                  ? "bg-[#FF8C42] text-white active:bg-[#E67A35]"
                  : "bg-[#E5E5E5] dark:bg-gray-700 text-[#BBB] dark:text-gray-500"
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
