import { ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router";

export function PrivacyPolicy() {
  const navigate = useNavigate();

  return (
    <div className="h-full bg-white dark:bg-gray-900 flex flex-col">
      <div className="flex items-center px-4 pt-[var(--app-safe-top)] h-[var(--app-header-height)] shrink-0 border-b border-[#F0F0F0] dark:border-gray-700">
        <button onClick={() => navigate(-1)} className="p-1 -ml-1">
          <ChevronLeft className="w-6 h-6 text-[#333] dark:text-gray-100" />
        </button>
        <h1 className="flex-1 text-center text-[17px] font-bold text-[#333] dark:text-gray-100 mr-6">隐私政策</h1>
      </div>

      <div className="flex-1 overflow-y-auto px-5 py-6 [&::-webkit-scrollbar]:hidden">
        <p className="text-[12px] text-[#999] dark:text-gray-400 mb-6">更新日期：2026年6月1日</p>

        <Section title="信息收集">
          <p>
            我们仅在您使用爪印服务时收集必要的信息，包括：
          </p>
          <ul className="list-disc pl-4 space-y-1">
            <li>账户信息：手机号码、昵称、头像</li>
            <li>宠物信息：您主动填写的宠物档案</li>
            <li>内容信息：您发布的帖子、评论、图片和视频</li>
            <li>位置信息：经您授权后获取的地理位置，用于发现附近的宠物友好地点</li>
            <li>设备信息：设备型号、操作系统版本，用于优化应用体验</li>
          </ul>
        </Section>

        <Section title="信息使用">
          <p>
            我们收集的信息仅用于以下目的：
          </p>
          <ul className="list-disc pl-4 space-y-1">
            <li>提供并维护爪印的核心功能</li>
            <li>个性化您的内容推荐和用户体验</li>
            <li>为您展示附近的宠物友好地点和宠友</li>
            <li>改进和优化我们的服务质量</li>
            <li>保障账户安全和防范欺诈</li>
          </ul>
          <p className="mt-2">我们不会将您的个人信息出售给任何第三方。</p>
        </Section>

        <Section title="信息存储">
          <p>
            您的个人信息存储在中国境内的服务器上。我们采取合理的安全措施保护您的信息免遭未经授权的访问、修改或删除。您发布的内容在注销账户后将被匿名化处理。
          </p>
        </Section>

        <Section title="联系我们">
          <p>
            如果您对本隐私政策有任何疑问或建议，请通过以下方式联系：
          </p>
          <p className="mt-2">
            邮箱：privacy@pawgram.com
          </p>
          <p className="mt-2 text-[#999] dark:text-gray-400 text-[11px]">
            广东雅和网络科技有限公司保留对本隐私政策的最终解释权。
          </p>
        </Section>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-6">
      <h2 className="text-[16px] font-bold text-[#333] dark:text-gray-100 mb-3">{title}</h2>
      <div className="text-[14px] text-[#666] dark:text-gray-300 leading-relaxed space-y-2">
        {children}
      </div>
    </div>
  );
}
