#!/bin/bash
# 用法: bash ~/Desktop/pawgram-ui/update.sh ~/Desktop/PAWGRAM（APP）.zip

ZIP="$1"
if [ ! -f "$ZIP" ]; then echo "拖 zip 文件到这个脚本上"; exit 1; fi

DIR=/Users/liliaoyuan/Desktop/pawgram-ui
cd "$DIR"

echo "1. 更新源码..."
rm -rf src
TMP=/tmp/pg$$
mkdir $TMP && cd $TMP && unzip -oq "$ZIP" "src/*"
cp -r src "$DIR/"

echo "2. 适配 iPhone..."
cd "$DIR"
sed -i '' 's/pt-\[54px\]/pt-0/g' src/app/pages/*.tsx
sed -i '' 's/className="bg-\[#FAFAFA\] min-h-screen flex items-center justify-center"/className="w-full h-full bg-white overflow-x-hidden overflow-y-auto"/' src/app/routes.tsx
sed -i '' '/className="font-sans antialiased w-\[393px\] h-\[852px\] relative bg-white overflow-x-hidden overflow-y-auto"/d' src/app/routes.tsx
sed -i '' 's|return <Outlet />;|return <Outlet />;\n  }|' src/app/routes.tsx

echo "3. 编译 & 部署到模拟器..."
npm run build && npx cap sync ios && npx cap run ios --target 672C7AED-621A-496E-92A6-B3255B8B35AA

echo "完成"
