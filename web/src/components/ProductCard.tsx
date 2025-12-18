import type { Product } from "@/types";
import Link from "next/link";
import { formatPrice } from "@/lib/formatPrice";

interface Props {
  product: Product;
}

export function ProductCard({ product }: Props) {
  return (
    <article className="glass flex flex-col rounded-2xl p-4">
      <Link href={`/products/${product.id}`} className="relative mb-4 aspect-[4/3] overflow-hidden rounded-xl bg-slate-100 block">
        <img
          src={
            product.hinhAnh ??
            "/images/products/placeholder.jpg"
          }
          alt={product.ten}
          className="h-full w-full object-cover transition duration-500 hover:scale-105"
        />
      </Link>
      <span className="text-xs font-semibold uppercase tracking-wide text-primary-600">
        {product.danhMuc}
      </span>
      <Link href={`/products/${product.id}`}>
        <h3 className="mt-1 text-lg font-semibold text-slate-900 hover:text-primary-600 transition-colors">
          {product.ten}
        </h3>
      </Link>
      <p className="mt-2 line-clamp-2 text-sm text-slate-600">{product.moTa}</p>
      <div className="mt-4 flex items-center justify-between">
        <span className="text-xl font-semibold text-slate-900">
          {formatPrice(product.gia)}
        </span>
        <Link href={`/products/${product.id}`}>
          <button className="rounded-full bg-primary-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-primary-500">
            Xem chi tiết
          </button>
        </Link>
      </div>
    </article>
  );
}

