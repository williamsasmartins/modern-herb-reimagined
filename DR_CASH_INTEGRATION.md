# Integração dr.cash - Instruções de Configuração

## Status Atual
✅ Formulário de pedido criado e funcional
✅ Edge function configurada para enviar leads
✅ API key do dr.cash armazenada com segurança

## O que você precisa fazer

### 1. Obter informações da sua conta dr.cash

Faça login no painel do dr.cash e obtenha:

- **Offer ID**: O ID da oferta específica que você está promovendo
- **Stream ID**: O ID do seu stream de tráfego
- **Endpoint correto**: URL específica para enviar leads (varia por oferta)

### 2. Atualizar a Edge Function

Edite o arquivo `supabase/functions/send-lead/index.ts`:

1. **Descomente e atualize o código de envio** (linhas ~42-57)
2. **Substitua a URL** pela URL correta fornecida pelo dr.cash:
   ```typescript
   const response = await fetch('SUA_URL_AQUI', {
     method: 'POST',
     headers: {
       'Content-Type': 'application/json',
     },
     body: JSON.stringify(leadData),
   });
   ```

3. **Adicione campos obrigatórios** ao `leadData`:
   ```typescript
   const leadData = {
     name: name,
     phone: phone,
     country: country,
     product: product,
     product_code: productCode,
     token: drCashApiKey,
     stream_id: 'SEU_STREAM_ID', // Obtenha do painel dr.cash
     offer_id: 'SEU_OFFER_ID', // Obtenha do painel dr.cash
     sub1: productCode,
     sub2: country,
   };
   ```

### 3. Endpoints comuns do dr.cash

Dependendo da sua configuração, o endpoint pode ser:

- `https://api.dr.cash/lead` (endpoint REST genérico)
- `https://[seu-dominio]/order.php` (se usar integração PHP)
- Endpoint personalizado fornecido pela equipe dr.cash

### 4. Testar a integração

1. Preencha o formulário em `/product/nano-slim`
2. Verifique os logs da edge function em Cloud → Functions → send-lead
3. Confirme que o lead aparece no painel do dr.cash

### 5. Campos de tracking (opcionais)

Os campos `sub1`, `sub2`, etc. são usados para rastrear:
- `sub1`: Código do produto
- `sub2`: País do cliente
- `sub3`: Campanha publicitária (se aplicável)
- `sub4`: Outras métricas personalizadas

## Suporte

Se precisar de ajuda:
1. Entre em contato com seu gerente de conta dr.cash
2. Consulte: https://blog.dr.cash/guides/how-to-send-leads-via-api/
3. Telegram: https://t.me/drcashglobal

## Arquitetura Atual

```
Cliente (Formulário)
    ↓
Edge Function (send-lead)
    ↓
API dr.cash
    ↓
Painel dr.cash (seus leads aparecem aqui)
```

A chave API está armazenada com segurança como secret no backend e nunca é exposta ao cliente.
